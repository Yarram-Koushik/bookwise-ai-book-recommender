from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.recommender import BookWiseRecommender
from app.schemas import RecommendRequest

app = FastAPI(
    title="BookWise AI API",
    description="Backend API for BookWise AI — Personalized Book Predictor",
    version="1.0.0",
)

# During development, allow all origins.
# In deployment, replace "*" with your Vercel frontend URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

recommender = BookWiseRecommender()


@app.get("/")
def health_check():
    return {
        "message": "BookWise AI API is running successfully 🚀",
        "docs": "/docs",
        "status": "healthy",
    }


@app.get("/books")
def get_books(limit: int = Query(50, ge=1, le=200)):
    return {
        "count": limit,
        "books": recommender.get_books(limit=limit),
    }


@app.get("/search")
def search_books(
    query: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
):
    results = recommender.search_books(query=query, limit=limit)
    return {
        "query": query,
        "count": len(results),
        "results": results,
    }


@app.get("/popular")
def get_popular_books(limit: int = Query(20, ge=1, le=100)):
    books = recommender.get_popular_books(limit=limit)
    return {
        "count": len(books),
        "books": books,
    }


@app.post("/recommend")
def recommend_books(request: RecommendRequest):
    result = recommender.recommend(title=request.title, top_n=request.top_n)

    if "error" in result:
        raise HTTPException(
            status_code=404,
            detail={
                "message": result["error"],
                "suggestions": result.get("suggestions", []),
            },
        )

    return result


@app.get("/book")
def get_book_details(title: str = Query(..., min_length=1)):
    book = recommender.get_book_details(title)
    if book is None:
        raise HTTPException(status_code=404, detail=f"Book '{title}' not found")
    return book


@app.get("/stats")
def get_stats():
    return recommender.get_stats()
