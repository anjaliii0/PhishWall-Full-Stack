const API_BASE_URL = "http://127.0.0.1:8000";

export const predictMessage = async (message) => {
  const response = await fetch(`${API_BASE_URL}/predict/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to get message prediction");
  }

  return await response.json();
};

export const predictUrl = async (url) => {
  const response = await fetch(`${API_BASE_URL}/predict/url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("Failed to get URL prediction");
  }

  return await response.json();
};

export const predictQr = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/predict/qr`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to scan QR code");
  }

  return await response.json();
};