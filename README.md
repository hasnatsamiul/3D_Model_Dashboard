## For LIVE Demo

https://3-d-model-dashboard.vercel.app/

## Project Overview

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
