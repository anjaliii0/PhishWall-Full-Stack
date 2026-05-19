import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-logo">Phish<span style={{color:"var(--amber)"}}>Wall</span></span>
          <span className="footer-sub">AI-powered phishing detection</span>
        </div>
        <div className="footer-right">
          <span className="footer-note">Built with XGBoost + BERT</span>
          <span className="footer-dot">·</span>
          <span className="footer-note">React + FastAPI</span>
        </div>
      </div>
    </footer>
  );
}