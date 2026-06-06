# Optional Backend Search Fix

Your backend is already working. This optional fix improves `/search` so queries like `Harry Potter` do not include unrelated titles.

## How to apply

Copy this file:

```text
backend-search-fix/recommender.py
```

Paste/replace it here in your project:

```text
bookwise-ai-book-recommender/backend/app/recommender.py
```

Then restart FastAPI:

```powershell
CTRL + C
uvicorn app.main:app --reload
```

Test:

```text
http://127.0.0.1:8000/search?query=Harry%20Potter&limit=10
```
