import json
import os
import numpy as np
import pandas as pd
import requests

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression
from joblib import dump, load


# ----------------------------------------------
# CONFIG
# ----------------------------------------------
DATA_URL = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/mpg.csv"
LATTICE_FILE = "data/lattice.json"
MODEL_FILE = "models/ml_model.pkl"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------------------
# STEP 1 — DOWNLOAD DATASET
# ----------------------------------------------
def download_open_dataset():
    df = pd.read_csv(DATA_URL)
    df = df[["weight", "horsepower", "acceleration"]].dropna()
    df.columns = ["weight", "hp", "acc"]
    return df


# ----------------------------------------------
# STEP 2 — PREPROCESS DATA
# ----------------------------------------------
def preprocess(df):
    scaler = MinMaxScaler()

    df[["weight_n", "hp_n", "acc_n"]] = scaler.fit_transform(
        df[["weight", "hp", "acc"]]
    )

    df["strength_score"] = df["hp_n"]
    df["material_mass"] = df["weight_n"]
    df["cost_factor"] = df["acc_n"]

    X = df[["strength_score", "material_mass", "cost_factor"]]
    y = (
        df["material_mass"] * 0.6
        + df["strength_score"] * 0.3
        + df["cost_factor"] * 0.1
    )

    return X, y


# ----------------------------------------------
# STEP 3 — TRAIN MODEL
# ----------------------------------------------
def train_model():
    df = download_open_dataset()
    X, y = preprocess(df)

    model = LinearRegression()
    model.fit(X, y)

    os.makedirs("models", exist_ok=True)
    dump(model, MODEL_FILE)
    print("Model trained & saved.")


# ----------------------------------------------
# STEP 4 — LOAD OR TRAIN MODEL
# ----------------------------------------------
def load_or_train_model():
    if not os.path.exists(MODEL_FILE):
        train_model()
    return load(MODEL_FILE)


model = load_or_train_model()


# ----------------------------------------------
# STEP 5 — LOAD LATTICE FILE
# ----------------------------------------------
def load_lattice():
    with open(LATTICE_FILE, "r") as f:
        return json.load(f)


# ----------------------------------------------
# STEP 6 — ENRICH LATTICE WITH ML FEATURES
# ----------------------------------------------
def enrich_lattice(lattice):
    for node in lattice["nodes"]:
        strength = float(np.random.uniform(0.2, 0.9))
        mass = float(np.random.uniform(0.2, 0.9))
        cost = float(np.random.uniform(0.1, 0.7))

        X = np.array([[strength, mass, cost]])
        recommended = float(model.predict(X)[0])

        node["data"] = {
            "strength_score": strength,
            "material_mass": mass,
            "cost_factor": cost,
            "recommended_aluminium_mass": recommended,
            "steel_ratio": float(max(0, 1 - recommended)),
            "aluminium_ratio": float(min(1, recommended)),
            "defect_prob_pred": float(abs(recommended * 0.2))
        }

    return lattice


# ----------------------------------------------
# API ROUTES
# ----------------------------------------------
@app.get("/")
def root():
    return {"message": "Car Front Panel ML API Running"}

@app.get("/lattice")
def get_lattice():
    lattice = load_lattice()
    enriched = enrich_lattice(lattice)
    return enriched
