import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

LATTICE_ENRICHED_FILE = Path("backend/data/lattice_enriched.json")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Car Front Panel API Running "}

@app.get("/lattice")
def get_lattice():
    # super fast (just file read)
    return json.loads(LATTICE_ENRICHED_FILE.read_text())
