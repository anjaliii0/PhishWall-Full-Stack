import "./About.css";

const models = [
  {
    name: "URL Model",
    tech: "Random Forest",
    badge: "Classical ML",
    badgeColor: "green",
    scanType: "URL Scanner + QR Code (URL)",
    dataset: "PhishTank + UCI Phishing URLs",
    howTrained:
      "Trained on structured feature vectors extracted from raw URLs. No raw text — only engineered numerical features fed into a Random Forest classifier with 100+ decision trees.",
    features: [
      "URL length",
      "Entropy of URL",
      "IP address in hostname",
      "HTTPS present / absent",
      "Domain age (WHOIS)",
      "Subdomain count",
      "Special char ratio",
      "Suspicious TLD (.xyz, .tk)",
      "Digit ratio in domain",
      "Redirect hop count",
      "@ symbol in URL",
      "URL depth (path levels)",
    ],
  },
  {
    name: "SMS Model",
    tech: "Logistic Regression",
    badge: "NLP",
    badgeColor: "amber",
    scanType: "SMS Scanner + QR Code (SMS)",
    dataset: "SMS Spam Collection — Kaggle (5,574 messages)",
    howTrained:
      "Text vectorized using TF-IDF (Term Frequency–Inverse Document Frequency) to convert raw SMS messages into numerical feature vectors. Logistic Regression classifies as phishing or legitimate based on learned word weights.",
    features: [
      "TF-IDF text vectorization",
      "Urgency keyword patterns",
      "Link / URL mentions",
      "OTP / prize / win signals",
      "Impersonation language",
      "Short message anomaly",
    ],
  },
  {
    name: "Email Model",
    tech: "Logistic Regression",
    badge: "NLP",
    badgeColor: "amber",
    scanType: "Email Scanner",
    dataset: "Phishing Email Dataset — Kaggle",
    howTrained:
      "Full email body text is cleaned, lowercased, and stop words removed. TF-IDF vectorizer converts it to feature vectors. Logistic Regression outputs a probability score — above 0.5 is flagged as phishing.",
    features: [
      "TF-IDF on full body text",
      "Credential harvest signals",
      "Fake account alert patterns",
      "Suspicious link language",
      "Prize / lottery scam cues",
      "Sender impersonation signals",
    ],
  },
];

const steps = [
  {
    num: "01",
    title: "You input content",
    desc: "Paste a URL, SMS, email text — or upload a QR code image. PhishWall identifies the input type automatically.",
  },
  {
    num: "02",
    title: "Preprocessing",
    desc: "URLs are parsed into 12 numerical features. Text inputs are cleaned and vectorized using TF-IDF. QR codes are decoded first, then routed.",
  },
  {
    num: "03",
    title: "Model inference",
    desc: "Random Forest runs on URL features. Logistic Regression runs on TF-IDF vectors for SMS and Email. FastAPI serves both models via REST endpoints.",
  },
  {
    num: "04",
    title: "Verdict returned",
    desc: "A threat score, confidence percentage, and list of flagged indicators is returned to the React frontend in real time.",
  },
];

const qrFlow = [
  { step: "Upload QR image", icon: "📷" },
  { step: "Decode with pyzbar / opencv", icon: "🔍" },
  { step: "Detect: URL or SMS text?", icon: "🔀" },
  { step: "Route to correct model", icon: "🤖" },
  { step: "Return verdict", icon: "✅" },
];

function ModelCard({ model }) {
  return (
    <div className="model-card">
      <div className="model-top">
        <div>
          <span className={`model-badge ${model.badgeColor}`}>
            {model.badge}
          </span>
          <h3 className="model-name">{model.name}</h3>
          <p className="model-tech">{model.tech}</p>
        </div>
      </div>
      <div className="model-dataset">
        <span className="dataset-label">Used for</span>
        <span className="dataset-val">{model.scanType}</span>
      </div>
      <div className="model-dataset" style={{ marginTop: "6px" }}>
        <span className="dataset-label">Dataset</span>
        <span className="dataset-val">{model.dataset}</span>
      </div>
      <p className="model-how">{model.howTrained}</p>
      <div className="model-features">
        {model.features.map((f) => (
          <span key={f} className="feat-chip">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className="about-page">
      <div className="about-wrap">
        {/* Hero */}
        <div className="about-hero">
          <p className="about-eyebrow">Under the hood</p>
          <h1 className="about-title">
            Real ML models.
            <br />
            Real phishing data.
          </h1>
          <p className="about-desc">
            PhishWall is a full-stack intelligent phishing detection system
            built from scratch. Three trained ML models — a Random Forest for
            URL analysis and Logistic Regression models for SMS and email — are
            served via a FastAPI backend and connected to a React frontend. QR
            code scanning ties it all together by decoding images and routing
            them through the correct model automatically.
          </p>
        </div>

        {/* Pipeline */}
        <section className="pipeline-section">
          <h2 className="section-title">Detection pipeline</h2>
          <div className="steps-grid">
            {steps.map((s) => (
              <div className="step-card" key={s.num}>
                <span className="step-num">{s.num}</span>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Models */}
        <section className="models-section">
          <h2 className="section-title">Model breakdown</h2>
          <div className="models-grid">
            {models.map((m) => (
              <ModelCard key={m.name} model={m} />
            ))}
          </div>
        </section>

        {/* QR Flow */}
        <section className="qr-section">
          <h2 className="section-title">QR code detection flow</h2>
          <p className="qr-intro">
            QR code phishing — called <strong>quishing</strong> — is a rapidly
            growing attack vector where malicious links are hidden inside
            scannable QR images. PhishWall decodes the QR, inspects whether the
            content is a URL or text, and routes it to the appropriate model
            automatically.
          </p>
          <div className="qr-flow">
            {qrFlow.map((q, i) => (
              <div key={q.step} className="qr-flow-row">
                <div className="qr-step">
                  <span className="qr-icon">{q.icon}</span>
                  <span className="qr-label">{q.step}</span>
                </div>
                {i < qrFlow.length - 1 && <span className="qr-arrow">↓</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Stack */}
        <section className="stack-section">
          <h2 className="section-title">Tech stack</h2>
          <div className="stack-grid">
            {[
              {
                layer: "Frontend",
                items: [
                  "React.js",
                  "React Router DOM",
                  "Vite",
                  "CSS Variables",
                ],
              },
              {
                layer: "Backend",
                items: ["FastAPI", "Python 3.11", "Uvicorn", "Pydantic"],
              },
              {
                layer: "ML / Data",
                items: [
                  "Scikit-learn",
                  "Random Forest",
                  "Logistic Regression",
                  "TF-IDF",
                  "joblib",
                ],
              },
              { layer: "QR Decoding", items: ["pyzbar", "OpenCV", "Pillow"] },
              {
                layer: "Datasets",
                items: [
                  "PhishTank",
                  "UCI Phishing URLs",
                  "SMS Spam Collection",
                  "Kaggle Email Dataset",
                ],
              },
              {
                layer: "Deployment",
                items: ["Vercel (frontend)", "Render (backend)"],
              },
            ].map((s) => (
              <div className="stack-card" key={s.layer}>
                <p className="stack-layer">{s.layer}</p>
                <div className="stack-items">
                  {s.items.map((i) => (
                    <span key={i} className="stack-chip">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
