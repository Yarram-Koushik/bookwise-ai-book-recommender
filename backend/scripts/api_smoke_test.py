"""
Small API logic test without starting the server.
Run from backend folder:
    python scripts/api_smoke_test.py
"""

from app.recommender import BookWiseRecommender


def main():
    recommender = BookWiseRecommender()

    print("\n✅ Model loaded successfully")
    print("\n📊 Stats:")
    print(recommender.get_stats())

    print("\n🔍 Search test for 'Harry Potter':")
    for book in recommender.search_books("Harry Potter", limit=5):
        print("-", book["title"], "|", book["author"])

    print("\n📚 Recommendation test:")
    result = recommender.recommend("Harry Potter", top_n=5)
    if "error" in result:
        print(result)
    else:
        print("Selected:", result["selected_book"]["title"])
        for book in result["recommendations"]:
            print("-", book["title"], "| score:", book["similarity_score"])


if __name__ == "__main__":
    main()
