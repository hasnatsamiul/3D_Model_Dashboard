import os
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression
from joblib import dump

DATA_URL = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/mpg.csv"
MODEL_FILE = "backend/models/ml_model.pkl"

def download_open_dataset():
    df = pd.read_csv(DATA_URL)
    df = df[["weight", "horsepower", "acceleration"]].dropna()
    df.columns = ["weight", "hp", "acc"]
    return df

def preprocess(df):
    scaler = MinMaxScaler()
    df[["weight_n", "hp_n", "acc_n"]] = scaler.fit_transform(df[["weight", "hp", "acc"]])

    df["strength_score"] = df["hp_n"]
    df["material_mass"] = df["weight_n"]
    df["cost_factor"] = df["acc_n"]

    X = df[["strength_score", "material_mass", "cost_factor"]]
    y = df["material_mass"] * 0.6 + df["strength_score"] * 0.3 + df["cost_factor"] * 0.1
    return X, y

def train_and_save():
    df = download_open_dataset()
    X, y = preprocess(df)

    model = LinearRegression()
    model.fit(X, y)

    os.makedirs("backend/models", exist_ok=True)
    dump(model, MODEL_FILE)
    print(f" Model trained & saved to {MODEL_FILE}")

if __name__ == "__main__":
    train_and_save()
