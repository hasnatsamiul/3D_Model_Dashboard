## For LIVE Demo

https://3-d-model-dashboard.vercel.app/

Sometimes it takes Minutes to load the lattice data.

<img width="1497" height="828" alt="Screenshot 2026-08-25 at 13 47 24" src="https://github.com/user-attachments/assets/b1436cc1-fa07-4913-8aee-c9438494bb8d" />

<img width="1490" height="784" alt="Screenshot 2026-08-25 at 13 53 51" src="https://github.com/user-attachments/assets/5d79cb71-b80e-49a4-ab76-011689d32d83" />


<img width="1499" height="762" alt="Screenshot 2026-08-25 at 13 51 13" src="https://github.com/user-attachments/assets/f73cc35c-8038-4070-8618-2b3564ab4f3e" />


## How to run
## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
python lattice_generator.py
uvicorn app:app --reload --port 8000
```
## After run Test the API in Browser

http://127.0.0.1:8000/lattice

## Frontend

```bash
cd frontend
npm run dev
```

# Project Overview

A FastAPI-based backend service that provides a 3D lattice structure enriched with machine-learning–based material recommendations.
The API is designed for real-time 3D visualization dashboards and optimized for fast cloud deployment. This project demonstrates how machine learning can be integrated into a 3D structural model and exposed through a lightweight REST API.

The system:

- Builds a 3D lattice graph (nodes + edges).

- Applies an ML model to recommend material distribution per node.

- Precomputes results for high-performance API responses.

- Serves the data to frontend applications such as Three.js dashboards.

## Input Feature

- strength_score

- material_mass

- cost_factor

## Output Feature

- recommended_aluminium_mass

- steel_ratio

- aluminium_ratio

- defect_prob_pred

## Performance-Focused Design

To ensure fast startup and stable performance in production:

- ML training runs offline only.

- Lattice enrichment is precomputed once.

- API serves cached JSON data.

- No heavy computation runs at request time.

## Future Improvements

- Replace synthetic features with real sensor data.

- Model versioning and comparison.

- Response compression for large lattices.

- Authentication and access control.

## Contact
smhasnats@gmail.com
