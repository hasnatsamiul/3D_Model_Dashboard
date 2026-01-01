import json
import numpy as np
from pathlib import Path
from joblib import load

# backend/
BASE_DIR = Path(__file__).resolve().parent

LATTICE_FILE = BASE_DIR / "data" / "lattice.json"
MODEL_FILE   = BASE_DIR / "models" / "ml_model.pkl"
OUT_FILE     = BASE_DIR / "data" / "lattice_enriched.json"


def enrich_and_save(seed: int = 42):
    np.random.seed(seed)

    lattice = json.loads(LATTICE_FILE.read_text())
    model = load(MODEL_FILE)

    n = len(lattice["nodes"])

    strength = np.random.uniform(0.2, 0.9, size=n).astype(np.float32)
    mass     = np.random.uniform(0.2, 0.9, size=n).astype(np.float32)
    cost     = np.random.uniform(0.1, 0.7, size=n).astype(np.float32)

    X = np.stack([strength, mass, cost], axis=1)
    preds = model.predict(X).astype(np.float32)

    for i, node in enumerate(lattice["nodes"]):
        rec = float(preds[i])
        node["data"] = {
            "strength_score": float(strength[i]),
            "material_mass": float(mass[i]),
            "cost_factor": float(cost[i]),
            "recommended_aluminium_mass": rec,
            "steel_ratio": float(max(0.0, 1.0 - rec)),
            "aluminium_ratio": float(min(1.0, rec)),
            "defect_prob_pred": float(abs(rec * 0.2)),
        }

    OUT_FILE.write_text(json.dumps(lattice, indent=2))
    print(f"Saved -> {OUT_FILE} ({n} nodes)")


if __name__ == "__main__":
    enrich_and_save()
