from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import os

from utils.text_cleaner import clean_text

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model_path = os.path.join(BASE_DIR, "models", "message_model.pkl")
vectorizer_path = os.path.join(BASE_DIR, "models", "message_vectorizer.pkl")

message_model = joblib.load(model_path)
message_vectorizer = joblib.load(vectorizer_path)


class MessageRequest(BaseModel):
    message: str


@router.post("/predict/message")
def predict_message(request: MessageRequest):
    message = request.message

    cleaned_message = clean_text(message)

    vector = message_vectorizer.transform([cleaned_message])

    prediction = message_model.predict(vector)[0]
    probability = message_model.predict_proba(vector)[0]

    safe_prob = probability[0] * 100
    spam_prob = probability[1] * 100

    if prediction == 1:
        verdict = "phishing"
        label = "Spam / Possible Phishing"
        confidence = spam_prob
        score = spam_prob
        flags = [
            "Message contains suspicious phishing/spam patterns",
            "Avoid clicking links or sharing personal information"
        ]
    else:
        verdict = "safe"
        label = "Safe / Ham"
        confidence = safe_prob
        score = spam_prob
        flags = [
            "No strong phishing/spam pattern detected",
            "Still verify links and sender before trusting the message"
        ]

    return {
        "input": message,
        "prediction": label,
        "verdict": verdict,
        "confidence": round(float(confidence), 2),
        "score": round(float(score), 2),
        "safe_probability": round(float(safe_prob), 2),
        "spam_probability": round(float(spam_prob), 2),
        "flags": flags,
        "model": "TF-IDF + Logistic Regression"
    }