import { useNavigate } from "react-router-dom";
import "./Home.css";

const stats = [
  { value: "4", label: "Scan types supported" },
  { value: "3", label: "ML models deployed" },
  { value: "<500ms", label: "Avg. response time" },
  { value: "100%", label: "Open source datasets" },
];

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13 7H7M10 4V10M4 10C4 14.4 6.7 18.1 10 19C13.3 18.1 16 14.4 16 10V5L10 3L4 5V10Z"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Random Forest",
    title: "URL Scanner",
    desc: "Paste any suspicious link and get an instant verdict. Our Random Forest model analyzes 12+ structural features — domain age, entropy, special characters, redirects and more — trained on real phishing URL datasets from PhishTank and UCI.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 5C2 4.4 2.4 4 3 4H17C17.6 4 18 4.4 18 5V13C18 13.6 17.6 14 17 14H11L8 17V14H3C2.4 14 2 13.6 2 13V5Z"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Logistic Regression",
    title: "SMS Scanner",
    desc: "Paste any SMS message to detect smishing attacks. The model is trained on the SMS Spam Collection dataset and picks up urgency language, suspicious links, OTP scams, and impersonation patterns common in phishing texts.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 5H17M3 5L10 11L17 5M3 5V15C3 15.6 3.4 16 4 16H16C16.6 16 17 15.6 17 15V5"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Logistic Regression",
    title: "Email Scanner",
    desc: "Paste email body content to check for phishing. Trained on a Kaggle phishing email dataset, the model detects credential harvesting attempts, fake account alerts, prize scams, and suspicious sender signals.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="12" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="3" y="12" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M12 12H14M14 12V14M14 14H17M17 14V17H14M14 17H12V14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "QR + URL Model",
    title: "QR Code Scanner",
    desc: "Upload any QR code image. PhishWall decodes the embedded URL or text, then automatically routes it through the URL or SMS model for analysis. Catches quishing — phishing hidden inside QR codes — which is one of the fastest growing attack vectors.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Choose your scan type",
    desc: "Select URL, SMS, Email, or QR Code from the scanner tabs.",
  },
  {
    step: "02",
    title: "Paste or upload",
    desc: "Paste your content directly or upload a QR code image. No account needed.",
  },
  {
    step: "03",
    title: "ML model runs",
    desc: "The right model is selected automatically — Random Forest for URLs, Logistic Regression for text.",
  },
  {
    step: "04",
    title: "Get your verdict",
    desc: "See a threat score, confidence level, and the specific indicators that triggered the result.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot" />
          ML-Powered Phishing Detection
        </div>
        <h1 className="hero-title">
          Don't click. Verify first.<br />
          <span className="hero-highlight">PhishWall has you covered.</span>
        </h1>
        <p className="hero-desc">
          PhishWall is an intelligent threat detection system that scans URLs, SMS messages,
          emails, and QR codes for phishing using trained machine learning models —
          built with Python, scikit-learn, FastAPI, and React.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate("/scan")}>
            Start Scanning
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="btn-ghost" onClick={() => navigate("/about")}>
            How it works
          </button>
        </div>
        <div className="hero-stats">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="features-inner">
          <p className="features-eyebrow">What PhishWall detects</p>
          <h2 className="features-title">Four scan types. One intelligent system.</h2>
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-card-top">
                  <div className="feature-icon">{f.icon}</div>
                  <span className="feature-label">{f.label}</span>
                </div>
                <h3 className="feature-name">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="hiw-section">
        <div className="hiw-inner">
          <p className="features-eyebrow">Simple by design</p>
          <h2 className="features-title">How it works</h2>
          <div className="hiw-grid">
            {howItWorks.map((h, i) => (
              <div className="hiw-card" key={h.step}>
                <div className="hiw-top">
                  <span className="hiw-step">{h.step}</span>
                  {i < howItWorks.length - 1 && <span className="hiw-arrow">→</span>}
                </div>
                <h3 className="hiw-title">{h.title}</h3>
                <p className="hiw-desc">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className="why-section">
        <div className="why-inner">
          <div className="why-text">
            <p className="about-eyebrow" style={{marginBottom:"12px"}}>Why phishing detection matters</p>
            <h2 className="why-title">Phishing is the #1 cause of data breaches worldwide.</h2>
            <p className="why-desc">
              Over 3.4 billion phishing emails are sent every single day. Attackers now
              embed malicious links inside QR codes, disguise them in SMS messages, and
              craft convincing fake emails that bypass spam filters. Traditional blocklists
              can't keep up — they only catch what they've already seen.
            </p>
            <p className="why-desc" style={{marginTop:"12px"}}>
              PhishWall uses machine learning models trained on real-world phishing data
              to detect threats based on behavior and patterns — not just known bad actors.
              It can flag links and messages it has never encountered before.
            </p>
          </div>
          <div className="why-stats-col">
            {[
              { val: "3.4B", desc: "Phishing emails sent per day" },
              { val: "36%", desc: "Of breaches involve phishing" },
              { val: "QR", desc: "Quishing attacks up 587% in 2024" },
            ].map((w) => (
              <div className="why-stat" key={w.val}>
                <span className="why-stat-val">{w.val}</span>
                <span className="why-stat-desc">{w.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Got a suspicious link or message?</h2>
          <p className="cta-sub">
            Paste it into PhishWall. URL, SMS, email, or QR code — we'll analyze it
            and give you a verdict in under a second.
          </p>
          <button className="btn-primary" onClick={() => navigate("/scan")}>
            Open Scanner
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

    </div>
  );
}