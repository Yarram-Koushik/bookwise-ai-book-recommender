from __future__ import annotations

import difflib
import html
from typing import Any

import numpy as np
import pandas as pd

from app.data_loader import load_pickle


def _clean_text(value: Any, default: str = "") -> str:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return default
    return html.unescape(str(value)).strip()


def _safe_int(value: Any) -> int | None:
    try:
        if value is None or pd.isna(value):
            return None
        return int(value)
    except Exception:
        return None


def _safe_float(value: Any) -> float | None:
    try:
        if value is None or pd.isna(value):
            return None
        return round(float(value), 3)
    except Exception:
        return None


class BookWiseRecommender:
    def __init__(self) -> None:
        self.similarity_scores = load_pickle("similarity.pkl")
        self.pivot_table = load_pickle("pivot_table.pkl")
        self.popular_books = load_pickle("popular_books.pkl")
        self.book_details = load_pickle("book_details.pkl")

        self.titles = list(self.pivot_table.index)
        self.title_lookup = {title.lower(): title for title in self.titles}

        # Keep one clean row per title for fast lookup.
        details = self.book_details.copy()
        details["title_key"] = details["title"].astype(str).str.lower()
        self.details_by_title = details.drop_duplicates("title_key").set_index("title_key")

    def _book_dict(self, title: str, similarity_score: float | None = None) -> dict:
        key = title.lower()

        if key in self.details_by_title.index:
            row = self.details_by_title.loc[key]
            book = {
                "title": _clean_text(row.get("title"), title),
                "author": _clean_text(row.get("author"), "Unknown"),
                "year": _safe_int(row.get("year")),
                "publisher": _clean_text(row.get("publisher"), "Unknown"),
                "image_url": _clean_text(row.get("image_url"), ""),
                "avg_rating": _safe_float(row.get("avg_rating")),
                "num_ratings": _safe_int(row.get("num_ratings")),
            }
        else:
            book = {
                "title": _clean_text(title),
                "author": "Unknown",
                "year": None,
                "publisher": "Unknown",
                "image_url": "",
                "avg_rating": None,
                "num_ratings": None,
            }

        if similarity_score is not None:
            book["similarity_score"] = round(float(similarity_score), 3)
        else:
            book["similarity_score"] = None

        return book

    def _match_title(self, user_title: str) -> str | None:
        query = user_title.strip().lower()
        if not query:
            return None

        # 1. Exact case-insensitive match.
        if query in self.title_lookup:
            return self.title_lookup[query]

        # 2. Prefer titles that contain the full query.
        contains = [title for title in self.titles if query in title.lower()]
        if contains:
            contains = sorted(
                contains,
                key=lambda title: (
                    not title.lower().startswith(query),
                    -1 * (self._book_dict(title).get("num_ratings") or 0),
                    len(title),
                ),
            )
            return contains[0]

        # 3. Fuzzy fallback.
        matches = difflib.get_close_matches(user_title, self.titles, n=1, cutoff=0.45)
        if matches:
            return matches[0]

        return None

    def search_books(self, query: str, limit: int = 10) -> list[dict]:
        query = query.strip().lower()
        if not query:
            return self.get_books(limit=limit)

        query_words = [word for word in query.split() if len(word) > 1]

        def relevance_score(title: str) -> tuple:
            title_lower = title.lower()
            book = self._book_dict(title)
            num_ratings = book.get("num_ratings") or 0

            # Lower tuple is better. This keeps exact/strong title matches above fuzzy/noisy matches.
            if title_lower == query:
                rank = 0
            elif title_lower.startswith(query):
                rank = 1
            elif query in title_lower:
                rank = 2
            elif query_words and all(word in title_lower for word in query_words):
                rank = 3
            elif query_words and any(word in title_lower for word in query_words):
                rank = 4
            else:
                rank = 5

            return (rank, -num_ratings, len(title_lower))

        direct_matches = []
        for title in self.titles:
            title_lower = title.lower()
            if (
                title_lower == query
                or title_lower.startswith(query)
                or query in title_lower
                or (query_words and all(word in title_lower for word in query_words))
            ):
                direct_matches.append(title)

        # Use fuzzy only when direct matches are not enough. This avoids unrelated search results.
        fuzzy_matches = []
        if len(direct_matches) < limit:
            fuzzy_matches = difflib.get_close_matches(query, self.titles, n=limit, cutoff=0.55)

        combined: list[str] = []
        for title in direct_matches + fuzzy_matches:
            if title not in combined:
                combined.append(title)

        combined = sorted(combined, key=relevance_score)
        return [self._book_dict(title) for title in combined[:limit]]

    def get_books(self, limit: int = 50) -> list[dict]:
        details = self.book_details.copy()
        if "num_ratings" in details.columns:
            details = details.sort_values(by="num_ratings", ascending=False)

        results = []
        for _, row in details.head(limit).iterrows():
            results.append(self._book_dict(str(row["title"])))
        return results

    def get_popular_books(self, limit: int = 20) -> list[dict]:
        popular = self.popular_books.head(limit).copy()
        results = []

        for _, row in popular.iterrows():
            title = str(row["title"])
            book = self._book_dict(title)
            book["avg_rating"] = _safe_float(row.get("avg_rating"))
            book["num_ratings"] = _safe_int(row.get("num_ratings"))
            results.append(book)

        return results

    def recommend(self, title: str, top_n: int = 8) -> dict:
        matched_title = self._match_title(title)
        if matched_title is None:
            suggestions = self.search_books(title, limit=5)
            return {
                "error": f"Book '{title}' was not found in the trained model.",
                "suggestions": suggestions,
            }

        book_index = np.where(self.pivot_table.index == matched_title)[0][0]
        distances = self.similarity_scores[book_index]

        similar_items = sorted(
            list(enumerate(distances)),
            key=lambda item: item[1],
            reverse=True,
        )[1 : top_n + 1]

        recommendations = []
        for idx, score in similar_items:
            recommended_title = self.pivot_table.index[idx]
            recommendations.append(self._book_dict(recommended_title, similarity_score=score))

        return {
            "selected_book": self._book_dict(matched_title),
            "recommendations": recommendations,
        }

    def get_book_details(self, title: str) -> dict | None:
        matched_title = self._match_title(title)
        if matched_title is None:
            return None
        return self._book_dict(matched_title)

    def get_stats(self) -> dict:
        details = self.book_details.copy()
        average_rating = None
        highest_rated_book = None
        most_rated_book = None

        if not details.empty:
            if "avg_rating" in details.columns:
                average_rating = round(float(details["avg_rating"].mean()), 2)
                highest_row = details.sort_values(by="avg_rating", ascending=False).head(1)
                if not highest_row.empty:
                    highest_rated_book = _clean_text(highest_row.iloc[0].get("title"))

            if "num_ratings" in details.columns:
                most_rated_row = details.sort_values(by="num_ratings", ascending=False).head(1)
                if not most_rated_row.empty:
                    most_rated_book = _clean_text(most_rated_row.iloc[0].get("title"))

        return {
            "total_books_in_model": int(len(self.titles)),
            "total_popular_books": int(len(self.popular_books)),
            "average_rating": average_rating,
            "highest_rated_book": highest_rated_book,
            "most_rated_book": most_rated_book,
        }
