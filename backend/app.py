import json
from pathlib import Path
from functools import lru_cache

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# -----------------------
# PATHS (SAFE ON RENDER)
# -----------------------
BASE_DIR = Path(__file__).resolve().parent
LATTICE_FILE = BASE_DIR / "data" / "lattice_enriched.json"

# -----------------------
# APP
# -----------------------
app = FastAPI(title="3D Model Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# CACHE (LOAD ONCE)
# -----------------------
@lru_cache(maxsize=1)
def load_lattice():
    if not LATTICE_FILE.exists():
        raise FileNotFoundError(
            "lattice_enriched.json not found. "
            "Run enrich_lattice.py before deploying."
        )
    return json.loads(LATTICE_FILE.read_text())

# -----------------------
# ROUTES
# -----------------------
@app.get("/")
def root():
    return {"status": "API running fast "}

@app.get("/lattice")
def get_lattice():
    return load_lattice()
