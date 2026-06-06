from typing import List, Optional
from pydantic import BaseModel, Field


class Book(BaseModel):
    title: str
    author: str = "Unknown"
    year: Optional[int] = None
    publisher: str = "Unknown"
    image_url: str = ""
    avg_rating: Optional[float] = None
    num_ratings: Optional[int] = None
    similarity_score: Optional[float] = None


class RecommendRequest(BaseModel):
    title: str = Field(..., min_length=1, description="Book title selected by user")
    top_n: int = Field(8, ge=1, le=20, description="Number of recommendations to return")


class RecommendResponse(BaseModel):
    selected_book: Book
    recommendations: List[Book]


class SearchResponse(BaseModel):
    query: str
    count: int
    results: List[Book]


class StatsResponse(BaseModel):
    total_books_in_model: int
    total_popular_books: int
    average_rating: Optional[float]
    highest_rated_book: Optional[str]
    most_rated_book: Optional[str]
