"""
Phase 1 training script for BookWise AI.

This script:
1. Loads Books.csv and Ratings.csv
2. Cleans the dataset
3. Builds a popularity-based recommendation table
4. Builds an item-item collaborative filtering model using cosine similarity
5. Saves model artifacts into backend/models/

Run from backend folder:
    python scripts/train_model.py
"""

from pathlib import Path
import pickle
import warnings

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

warnings.filterwarnings("ignore")

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"

BOOKS_FILE = DATA_DIR / "Books.csv"
RATINGS_FILE = DATA_DIR / "Ratings.csv"
USERS_FILE = DATA_DIR / "Users.csv"


def check_dataset_files() -> None:
    """Validate that required Kaggle files exist."""
    missing_files = [str(path) for path in [BOOKS_FILE, RATINGS_FILE, USERS_FILE] if not path.exists()]

    if missing_files:
        print("\n❌ Dataset files are missing.")
        print("Place these Kaggle files inside backend/data/:")
        print("- Books.csv")
        print("- Ratings.csv")
        print("- Users.csv")
        print("\nMissing:")
        for file in missing_files:
            print(f"  {file}")
        raise FileNotFoundError("Required dataset files not found.")


def load_data() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Load books, ratings, and users data."""
    print("📥 Loading dataset...")

    books = pd.read_csv(BOOKS_FILE, low_memory=False)
    ratings = pd.read_csv(RATINGS_FILE, low_memory=False)
    users = pd.read_csv(USERS_FILE, low_memory=False)

    print(f"Books shape   : {books.shape}")
    print(f"Ratings shape : {ratings.shape}")
    print(f"Users shape   : {users.shape}")

    return books, ratings, users


def clean_books(books: pd.DataFrame) -> pd.DataFrame:
    """Clean books data and standardize column names."""
    print("\n🧹 Cleaning books data...")

    required_columns = [
        "ISBN",
        "Book-Title",
        "Book-Author",
        "Year-Of-Publication",
        "Publisher",
        "Image-URL-M",
    ]

    missing = [col for col in required_columns if col not in books.columns]
    if missing:
        raise ValueError(f"Missing columns in Books.csv: {missing}")

    books = books[required_columns].copy()

    books.rename(
        columns={
            "ISBN": "isbn",
            "Book-Title": "title",
            "Book-Author": "author",
            "Year-Of-Publication": "year",
            "Publisher": "publisher",
            "Image-URL-M": "image_url",
        },
        inplace=True,
    )

    books["title"] = books["title"].astype(str).str.strip()
    books["author"] = books["author"].astype(str).str.strip()
    books["publisher"] = books["publisher"].astype(str).str.strip()
    books["year"] = pd.to_numeric(books["year"], errors="coerce")

    books.dropna(subset=["isbn", "title", "author"], inplace=True)
    books.drop_duplicates(subset=["isbn"], inplace=True)
    books.drop_duplicates(subset=["title"], keep="first", inplace=True)

    books["year"] = books["year"].fillna(0).astype(int)
    books["image_url"] = books["image_url"].fillna("")

    print(f"Cleaned books shape: {books.shape}")
    return books


def clean_ratings(ratings: pd.DataFrame) -> pd.DataFrame:
    """Clean ratings data and standardize column names."""
    print("\n🧹 Cleaning ratings data...")

    required_columns = ["User-ID", "ISBN", "Book-Rating"]
    missing = [col for col in required_columns if col not in ratings.columns]
    if missing:
        raise ValueError(f"Missing columns in Ratings.csv: {missing}")

    ratings = ratings[required_columns].copy()
    ratings.rename(
        columns={
            "User-ID": "user_id",
            "ISBN": "isbn",
            "Book-Rating": "rating",
        },
        inplace=True,
    )

    ratings["rating"] = pd.to_numeric(ratings["rating"], errors="coerce")
    ratings.dropna(subset=["user_id", "isbn", "rating"], inplace=True)
    ratings = ratings[(ratings["rating"] >= 0) & (ratings["rating"] <= 10)]

    print(f"Cleaned ratings shape: {ratings.shape}")
    return ratings


def build_popular_books(books: pd.DataFrame, ratings: pd.DataFrame) -> pd.DataFrame:
    """Create popularity-based books table."""
    print("\n⭐ Building popular books table...")

    merged = ratings.merge(books, on="isbn")

    popular_books = (
        merged.groupby(["title", "author", "image_url"], as_index=False)
        .agg(num_ratings=("rating", "count"), avg_rating=("rating", "mean"))
    )

    # A book should have enough ratings before we call it popular.
    popular_books = popular_books[popular_books["num_ratings"] >= 50]
    popular_books["avg_rating"] = popular_books["avg_rating"].round(2)

    # Sort by rating first, then number of ratings.
    popular_books = popular_books.sort_values(
        by=["avg_rating", "num_ratings"], ascending=False
    ).head(100)

    print(f"Popular books shape: {popular_books.shape}")
    return popular_books


def prepare_recommendation_data(
    books: pd.DataFrame,
    ratings: pd.DataFrame,
    min_user_ratings: int = 50,
    min_book_ratings: int = 20,
    max_books: int = 1200,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Prepare pivot table for collaborative filtering."""
    print("\n🔧 Preparing collaborative filtering data...")

    merged = ratings.merge(books, on="isbn")

    # Keep active users only. This reduces noise and memory usage.
    user_rating_counts = merged.groupby("user_id")["rating"].count()
    active_users = user_rating_counts[user_rating_counts >= min_user_ratings].index
    filtered = merged[merged["user_id"].isin(active_users)]

    # Keep books with enough ratings.
    book_rating_counts = filtered.groupby("title")["rating"].count()
    selected_books = book_rating_counts[book_rating_counts >= min_book_ratings].index
    filtered = filtered[filtered["title"].isin(selected_books)]

    if filtered.empty or filtered["title"].nunique() < 10:
        print("⚠️ Too little data after filtering. Using relaxed filters...")
        min_user_ratings = 10
        min_book_ratings = 5
        user_rating_counts = merged.groupby("user_id")["rating"].count()
        active_users = user_rating_counts[user_rating_counts >= min_user_ratings].index
        filtered = merged[merged["user_id"].isin(active_users)]
        book_rating_counts = filtered.groupby("title")["rating"].count()
        selected_books = book_rating_counts[book_rating_counts >= min_book_ratings].index
        filtered = filtered[filtered["title"].isin(selected_books)]

    # Limit to most rated books to keep similarity matrix deployable.
    top_titles = (
        filtered.groupby("title")["rating"]
        .count()
        .sort_values(ascending=False)
        .head(max_books)
        .index
    )
    filtered = filtered[filtered["title"].isin(top_titles)]

    pivot_table = filtered.pivot_table(
        index="title",
        columns="user_id",
        values="rating",
        fill_value=0,
    )

    # Details used by API/frontend later.
    book_details = (
        filtered.groupby("title", as_index=False)
        .agg(
            author=("author", "first"),
            year=("year", "first"),
            publisher=("publisher", "first"),
            image_url=("image_url", "first"),
            num_ratings=("rating", "count"),
            avg_rating=("rating", "mean"),
        )
    )
    book_details["avg_rating"] = book_details["avg_rating"].round(2)

    print(f"Filtered ratings shape : {filtered.shape}")
    print(f"Pivot table shape      : {pivot_table.shape}")
    print(f"Book details shape     : {book_details.shape}")

    return pivot_table, book_details, filtered


def train_similarity_model(pivot_table: pd.DataFrame) -> np.ndarray:
    """Train item-item cosine similarity matrix."""
    print("\n🧠 Training cosine similarity model...")
    similarity_scores = cosine_similarity(pivot_table)
    print(f"Similarity matrix shape: {similarity_scores.shape}")
    return similarity_scores


def save_artifacts(
    similarity_scores: np.ndarray,
    pivot_table: pd.DataFrame,
    books: pd.DataFrame,
    popular_books: pd.DataFrame,
    book_details: pd.DataFrame,
) -> None:
    """Save all model artifacts for Phase 2 backend."""
    print("\n💾 Saving model artifacts...")
    MODELS_DIR.mkdir(exist_ok=True)

    artifacts = {
        "similarity.pkl": similarity_scores,
        "pivot_table.pkl": pivot_table,
        "books.pkl": books,
        "popular_books.pkl": popular_books,
        "book_details.pkl": book_details,
    }

    for filename, obj in artifacts.items():
        output_path = MODELS_DIR / filename
        with open(output_path, "wb") as file:
            pickle.dump(obj, file)
        print(f"Saved: {output_path}")


def show_sample_recommendation(
    pivot_table: pd.DataFrame,
    similarity_scores: np.ndarray,
    book_details: pd.DataFrame,
    sample_title: str | None = None,
    top_n: int = 5,
) -> None:
    """Print a sample recommendation result."""
    print("\n🧪 Testing sample recommendation...")

    if sample_title is None:
        sample_title = pivot_table.index[0]

    if sample_title not in pivot_table.index:
        print(f"Book not found: {sample_title}")
        return

    book_index = np.where(pivot_table.index == sample_title)[0][0]
    distances = similarity_scores[book_index]
    similar_items = sorted(
        list(enumerate(distances)), key=lambda item: item[1], reverse=True
    )[1 : top_n + 1]

    print(f"\nBecause you selected: {sample_title}\n")
    for rank, (idx, score) in enumerate(similar_items, start=1):
        title = pivot_table.index[idx]
        detail = book_details[book_details["title"] == title].head(1)
        author = detail["author"].values[0] if not detail.empty else "Unknown"
        print(f"{rank}. {title} by {author} | similarity: {score:.3f}")


def main() -> None:
    check_dataset_files()

    raw_books, raw_ratings, _ = load_data()
    books = clean_books(raw_books)
    ratings = clean_ratings(raw_ratings)

    popular_books = build_popular_books(books, ratings)
    pivot_table, book_details, _ = prepare_recommendation_data(books, ratings)
    similarity_scores = train_similarity_model(pivot_table)

    save_artifacts(
        similarity_scores=similarity_scores,
        pivot_table=pivot_table,
        books=books,
        popular_books=popular_books,
        book_details=book_details,
    )

    show_sample_recommendation(pivot_table, similarity_scores, book_details)

    print("\n✅ Phase 1 completed successfully!")
    print("Next: We will use these .pkl files in FastAPI during Phase 2.")


if __name__ == "__main__":
    main()
