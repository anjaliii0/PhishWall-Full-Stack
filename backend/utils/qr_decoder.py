import cv2
import numpy as np
from PIL import Image
from io import BytesIO


def decode_qr_from_bytes(image_bytes: bytes):
    """
    Takes uploaded QR image bytes and returns decoded QR text.
    If no QR is found, returns None.
    """

    # Convert bytes to PIL image
    image = Image.open(BytesIO(image_bytes)).convert("RGB")

    # Convert PIL image to numpy array
    image_np = np.array(image)

    # Convert RGB to BGR because OpenCV uses BGR
    image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

    # Create QR detector
    detector = cv2.QRCodeDetector()

    # Decode QR
    data, bbox, _ = detector.detectAndDecode(image_bgr)

    if data:
        return data.strip()

    return None