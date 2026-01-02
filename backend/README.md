# Sami Lattice Backend

This backend provides:

- 3D lattice generator (`lattice_generator.py`)
- FastAPI server (`main.py`)
- CSV data ingestion
- Data preprocessing
- ML model for predicting defect probability
- API endpoints for the frontend dashboard

## How to run

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
python lattice_generator.py
uvicorn app:app --reload --port 8000
```
## Test API in Browser

http://127.0.0.1:8000/lattice

