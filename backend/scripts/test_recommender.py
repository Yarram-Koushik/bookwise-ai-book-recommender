"""
Test saved BookWise AI recommendation model.

Run from backend folder:
    python scripts/test_recommender.py
"""

from pathlib import Path
import pickle
import difflib

import numpy as np

BASE_DIR = Path(__file__).resolve().parents[1]
MODELS_DIR = BASE_DIR / "models"


def load_pickle(filename: str):
    path = MODELS_DIR / filename
    if not path.exists():
        raise FileNotFoundError(
            f"{path} not found. Run `python scripts/train_model.py` first."
        )
    with open(path, "rb") as file:
        return pickle.load(file)


def recommend(book_title: str, top_n: int = 5):
    similarity_scores = load_pickle("similarity.pkl")
    pivot_table = load_pickle("pivot_table.pkl")
    book_details = load_pickle("book_details.pkl")

    all_titles = list(pivot_table.index)

    if book_title not in all_titles:
        matches = difflib.get_close_matches(book_title, all_titles, n=5, cutoff=0.4)
        if not matches:
            return {
                "error": f"Book '{book_title}' not found.",
                "suggestions": all_titles[:10],
            }
        book_title = matches[0]

    book_index = np.where(pivot_table.index == book_title)[0][0]
    distances = similarity_scores[book_index]
    similar_items = sorted(
        list(enumerate(distances)), key=lambda item: item[1], reverse=True
    )[1 : top_n + 1]

    recommendations = []
    for idx, score in similar_items:
        title = pivot_table.index[idx]
        detail = book_details[book_details["title"] == title].head(1)

        if detail.empty:
            recommendations.append({"title": title, "similarity_score": round(float(score), 3)})
        else:
            row = detail.iloc[0]
            recommendations.append(
                {
                    "title": title,
                    "author": row["author"],
                    "year": int(row["year"]),
                    "publisher": row["publisher"],
                    "image_url": row["image_url"],
                    "avg_rating": float(row["avg_rating"]),
                    "num_ratings": int(row["num_ratings"]),
                    "similarity_score": round(float(score), 3),
                }
            )

    return {"selected_book": book_title, "recommendations": recommendations}


if __name__ == "__main__":
    print("\n📚 BookWise AI Recommendation Test")
    print("Type a book name. Example: Harry Potter")
    user_input = input("\nEnter book title: ").strip()

    result = recommend(user_input, top_n=5)

    if "error" in result:
        print("\n❌", result["error"])
        print("Suggestions:")
        for title in result["suggestions"]:
            print("-", title)
    else:
        print(f"\nBecause you selected: {result['selected_book']}\n")
        for i, book in enumerate(result["recommendations"], start=1):
            print(f"{i}. {book['title']}")
            print(f"   Author: {book.get('author', 'Unknown')}")
            print(f"   Avg rating: {book.get('avg_rating', 'N/A')}")
            print(f"   Similarity: {book['similarity_score']}")
