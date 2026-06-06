from functools import lru_cache
from pathlib import Path
import pickle
from typing import Any

BASE_DIR = Path(__file__).resolve().parents[1]
MODELS_DIR = BASE_DIR / "models"

REQUIRED_MODEL_FILES = [
    "similarity.pkl",
    "pivot_table.pkl",
    "popular_books.pkl",
    "book_details.pkl",
]


def validate_model_files() -> None:
    missing = [filename for filename in REQUIRED_MODEL_FILES if not (MODELS_DIR / filename).exists()]
    if missing:
        missing_text = ", ".join(missing)
        raise FileNotFoundError(
            f"Missing model files: {missing_text}. Run `python scripts/train_model.py` before starting the API."
        )


@lru_cache(maxsize=None)
def load_pickle(filename: str) -> Any:
    validate_model_files()
    path = MODELS_DIR / filename
    with open(path, "rb") as file:
        return pickle.load(file)
