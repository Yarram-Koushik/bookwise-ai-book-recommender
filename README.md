# BookWise AI — Personalized Book Predictor

BookWise AI is a machine-learning based book recommendation project.

## Current status

Phase 1 is prepared:

- Dataset setup
- Data cleaning
- Popular books generation
- Collaborative filtering model
- Cosine similarity model
- Saved `.pkl` artifacts for backend

## Tech stack planned

- Frontend: React.js, JavaScript, Tailwind CSS
- Backend: Python, FastAPI
- ML: Pandas, NumPy, Scikit-learn, Cosine Similarity
- Deployment: Vercel + Render

## Phase 1 setup

Go to backend:

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

Install dependencies:

```bash
pip install -r requirements.txt
```

Download the Kaggle Book Recommendation Dataset and place these files inside `backend/data/`:

```text
Books.csv
Ratings.csv
Users.csv
```

Train model:

```bash
python scripts/train_model.py
```

Test model:

```bash
python scripts/test_recommender.py
```

## Phase 1 output files

```text
backend/models/similarity.pkl
backend/models/pivot_table.pkl
backend/models/books.pkl
backend/models/popular_books.pkl
backend/models/book_details.pkl
```

These will be used in Phase 2 FastAPI backend.
