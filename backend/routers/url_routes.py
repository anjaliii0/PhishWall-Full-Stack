from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import os
import numpy as np

from utils.url_cleaner import url_to_dataframe

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

url_model_path = os.path.join(BASE_DIR, "models", "url_model.pkl")
feature_columns_path = os.path.join(BASE_DIR, "models", "url_feature_columns.pkl")

url_model = joblib.load(url_model_path)
FEATURE_COLS = joblib.load(feature_columns_path)


class URLRequest(BaseModel):
    url: str


def normalize_prediction(prediction):
    if isinstance(prediction, np.generic):
        prediction = prediction.item()

    if isinstance(prediction, str):
        pred = prediction.lower()

        if pred in ["phishing", "malicious", "bad", "unsafe"]:
            return 1

        if pred in ["legitimate", "safe", "benign", "good"]:
            return 0

    return int(prediction)


@router.post("/predict/url")
def predict_url(request: URLRequest):
    url = request.url.strip()

    # Same logic as Colab:
    # real URL -> extract features -> align columns -> predict
    X_real = url_to_dataframe(url, FEATURE_COLS, use_network=True)

    raw_prediction = url_model.predict(X_real)[0]
    prediction = normalize_prediction(raw_prediction)

    probability = url_model.predict_proba(X_real)[0]

    safe_prob = float(probability[0]) * 100
    phishing_prob = float(probability[1]) * 100

    if prediction == 1:
        verdict = "phishing"
        label = "Phishing URL"
        confidence = phishing_prob
        score = phishing_prob
        flags = [
            "URL contains suspicious phishing patterns",
            "Avoid entering passwords, OTPs, or banking details",
            "Verify the domain before clicking"
        ]
    else:
        verdict = "safe"
        label = "Legitimate URL"
        confidence = safe_prob
        score = phishing_prob
        flags = [
            "No strong phishing pattern detected",
            "Still verify the website before sharing sensitive information"
        ]

    return {
        "input": url,
        "prediction": label,
        "verdict": verdict,
        "confidence": round(float(confidence), 2),
        "score": round(float(score), 2),
        "safe_probability": round(float(safe_prob), 2),
        "phishing_probability": round(float(phishing_prob), 2),
        "raw_prediction": str(raw_prediction),
        "model": "Random Forest URL Feature Model",
        "flags": flags
    }