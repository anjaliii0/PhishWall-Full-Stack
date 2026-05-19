# PhishWall – AI-Based Phishing Detection Web App

PhishWall is a full-stack phishing detection web application that scans **URLs, SMS messages, emails, and QR codes** to identify possible phishing or suspicious content. The system uses machine learning models served through a FastAPI backend and provides a clean React-based user interface for real-time scanning.

---

## 🚀 Features

- Detect phishing or suspicious **URLs**
- Detect spam/phishing **SMS messages**
- Detect phishing-style **email content**
- Scan **QR code images**
- Decode QR codes and analyze the embedded URL
- Display prediction result with:
  - Verdict
  - Confidence score
  - Risk score
  - Safe probability
  - Phishing probability
  - Security notes
- React frontend with separate scanner tabs
- FastAPI backend with REST API endpoints
- Machine learning model integration using `.pkl` files

---

## 🛡️ Modules

### 1. URL Phishing Detection

The URL scanner analyzes a given URL and predicts whether it is safe or phishing based on URL-based features.

Example input:

```text
https://www.google.com

Example output:

Safe URL / Legitimate URL

2. SMS Phishing Detection

The SMS scanner checks message content and classifies it as safe or spam/phishing.

Example input:

URGENT: Your bank account will be blocked. Verify your KYC immediately.

Example output:

Spam / Possible Phishing

3. Email Phishing Detection

The email scanner analyzes email subject/body text and detects phishing-style content.

Example input:

Subject: Account Suspended

Dear customer, your account has been suspended due to suspicious activity. Click the link and verify your password immediately.

Example output:

Phishing / Suspicious Email

4. QR Code Phishing Detection

The QR scanner accepts a QR code image, decodes its content, extracts the embedded URL, and sends it to the URL phishing model.

Flow:

QR Image
↓
Decode QR content
↓
Extract URL
↓
Analyze using URL phishing model
↓
Show prediction result

🧠 Machine Learning Models

This project uses saved machine learning models in .pkl format.

Message Model

Used for both:

SMS phishing detection
Email phishing detection

The message model uses text preprocessing and vectorization to classify text as safe or phishing/spam.

URL Model

Used for:

URL phishing detection
QR code URL detection

The URL model extracts URL-based features and predicts whether the URL is legitimate or phishing.

🏗️ Project Structure

PHISHWALL/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── models/
│   │   ├── message_model.pkl
│   │   ├── message_vectorizer.pkl
│   │   └── model.pkl
│   ├── routers/
│   │   ├── message_routes.py
│   │   ├── url_routes.py
│   │   └── qr_routes.py
│   └── utils/
│       ├── text_cleaner.py
│       ├── url_cleaner.py
│       └── qr_decoder.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   └── Scanner.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

🛠️ Tech Stack


Frontend
React.js
Vite
CSS
Lucide React Icons
Backend
FastAPI
Python
Uvicorn
Scikit-learn
Pandas
NumPy
OpenCV
Pillow
Machine Learning
Text preprocessing
TF-IDF vectorization
Classification model for SMS/email
URL feature extraction
Random Forest / ML-based URL classification


⚙️ Backend Setup

Go to the backend folder:

cd backend

Create virtual environment:

python -m venv venv

Activate virtual environment:

For Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Run FastAPI server:

uvicorn main:app --reload

Backend will run at:

http://127.0.0.1:8000

Open API docs:

http://127.0.0.1:8000/docs
💻 Frontend Setup

Go to the frontend folder:

cd frontend

Install dependencies:

npm install

Run React app:

npm run dev

Frontend will run at:

http://localhost:5173

or:

http://localhost:5174
🔗 API Endpoints
Message Prediction
POST /predict/message

Request body:

{
  "message": "Congratulations! You won a free prize. Click here to claim now."
}
URL Prediction
POST /predict/url

Request body:

{
  "url": "http://paypal-secure-login.xyz/verify"
}
QR Code Prediction
POST /predict/qr

Request type:

multipart/form-data

Input:

QR image file
📊 Model Evaluation

The SMS/email model was evaluated using common classification metrics:

Accuracy
Precision
Recall
F1 Score
Confusion Matrix

Example performance:

Accuracy: 96%+
Recall: 93%+
F1 Score: 87%+


⚠️ Limitations
The system is based on machine learning predictions and may sometimes produce incorrect results.
Some safe messages may be marked suspicious if they contain words like OTP, bank, verify, password, or account.
Some phishing URLs may appear safe if they do not contain strong phishing patterns.
QR code detection depends on image clarity and successful QR decoding.
URL network-based features may be slower depending on internet and server response.

👩‍💻 Author

Anjali Sharma
```
