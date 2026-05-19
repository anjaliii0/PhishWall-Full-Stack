from fastapi import APIRouter, UploadFile, File, HTTPException
import re

from utils.qr_decoder import decode_qr_from_bytes
from utils.url_cleaner import url_to_dataframe

from routers.url_routes import url_model, FEATURE_COLS, normalize_prediction

router = APIRouter()


def extract_url_from_text(text: str):
    """
    Extracts first URL from decoded QR text.
    Handles clean URLs and messy pandas-style decoded text.
    """

    url_pattern = re.compile(
        r"(https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*)"
    )

    match = url_pattern.search(text.strip())

    if match:
        return match.group(0).strip()

    return None


@router.post("/predict/qr")
async def predict_qr(file: UploadFile = File(...)):
    """
    Upload QR image, decode content, extract URL, and scan it using existing URL model.
    """

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )

    image_bytes = await file.read()

    decoded_text = decode_qr_from_bytes(image_bytes)

    if not decoded_text:
        raise HTTPException(
            status_code=400,
            detail="Could not decode QR code. Please upload a clear QR image."
        )

    extracted_url = extract_url_from_text(decoded_text)

    if not extracted_url:
        return {
            "decoded_text": decoded_text,
            "type": "text",
            "prediction": "QR decoded successfully, but content is not a URL",
            "verdict": "unknown",
            "confidence": 0,
            "score": 0,
            "safe_probability": 0,
            "phishing_probability": 0,
            "model": "QR Decoder",
            "flags": [
                "QR code does not contain a URL",
                "Only URL-based QR phishing detection is enabled currently"
            ]
        }

    url = extracted_url.strip()

    if not url.startswith("http"):
        url = "http://" + url

    X_real = url_to_dataframe(url, FEATURE_COLS, use_network=True)

    raw_prediction = url_model.predict(X_real)[0]
    prediction = normalize_prediction(raw_prediction)

    probability = url_model.predict_proba(X_real)[0]

    safe_prob = float(probability[0]) * 100
    phishing_prob = float(probability[1]) * 100

    if prediction == 1:
        verdict = "phishing"
        label = "Phishing QR / Malicious URL"
        confidence = phishing_prob
        score = phishing_prob
        flags = [
            "QR code contains a suspicious URL",
            "Avoid opening this link or entering personal details",
            "Verify the domain before visiting"
        ]
    else:
        verdict = "safe"
        label = "Safe QR / Legitimate URL"
        confidence = safe_prob
        score = phishing_prob
        flags = [
            "QR code contains a URL with no strong phishing pattern detected",
            "Still verify the website before sharing sensitive information"
        ]

    return {
        "decoded_text": decoded_text,
        "extracted_url": url,
        "input": url,
        "type": "url",
        "prediction": label,
        "verdict": verdict,
        "confidence": round(float(confidence), 2),
        "score": round(float(score), 2),
        "safe_probability": round(float(safe_prob), 2),
        "phishing_probability": round(float(phishing_prob), 2),
        "raw_prediction": str(raw_prediction),
        "model": "QR Decoder + URL Phishing Model",
        "flags": flags
    }