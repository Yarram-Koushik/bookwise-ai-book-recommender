# Backend - Phase 1

This phase trains the recommendation model for BookWise AI.

## Phase 1 goal

Create a clean book recommendation engine using:

- Python
- Pandas
- NumPy
- Scikit-learn
- Cosine similarity
- Kaggle book rating dataset

## Required dataset files

Place these files inside `backend/data/`:

```text
Books.csv
Ratings.csv
Users.csv
```

## Setup

From the project root:

```bash
cd backend
python -m venv .venv
```

Activate environment:

Windows:

```bash
.venv\Scripts\activate
```

Mac/Linux:

```bash
source .venv/bin/activate
```

Install packages:

```bash
pip install -r requirements.txt
```

## Train model

```bash
python scripts/train_model.py
```

## Test recommendation

```bash
python scripts/test_recommender.py
```

## Output model files

After training, this folder will contain:

```text
backend/models/similarity.pkl
backend/models/pivot_table.pkl
backend/models/books.pkl
backend/models/popular_books.pkl
backend/models/book_details.pkl
```

These files will be used by the FastAPI backend in Phase 2.
