import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Link as LinkIcon,
  MessageSquare,
  Mail,
  QrCode,
  Upload,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  XCircle,
} from "lucide-react";

import { predictMessage, predictUrl, predictQr } from "../services/api";
import "./Scanner.css";

const Scanner = () => {
  const [activeTab, setActiveTab] = useState("url");

  const [inputs, setInputs] = useState({
    url: "",
    sms: "",
    email: "",
  });

  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const currentValue = activeTab === "qr" ? "" : inputs[activeTab] || "";

  const tabs = [
    {
      id: "url",
      label: "URL",
      icon: LinkIcon,
      placeholder: "Enter a website URL to scan...",
      description: "Check if a website link is safe or phishing.",
    },
    {
      id: "sms",
      label: "SMS",
      icon: MessageSquare,
      placeholder: "Paste an SMS message here...",
      description: "Detect spam or phishing patterns in SMS messages.",
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      placeholder: "Paste email subject/body here...",
      description: "Analyze email content for phishing attempts.",
    },
    {
      id: "qr",
      label: "QR Code",
      icon: QrCode,
      placeholder: "",
      description: "Upload a QR image and scan the embedded URL.",
    },
  ];

  const getRiskLevel = (score) => {
    if (score >= 70) return "High Risk";
    if (score >= 40) return "Suspicious";
    return "Low Risk";
  };

  const getResultIcon = (verdict) => {
    if (verdict === "phishing" || verdict === "spam") {
      return <AlertTriangle className="result-icon danger" />;
    }

    if (verdict === "suspicious") {
      return <AlertTriangle className="result-icon warning" />;
    }

    if (verdict === "safe" || verdict === "ham") {
      return <CheckCircle className="result-icon safe" />;
    }

    return <XCircle className="result-icon warning" />;
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setResult(null);
    setError("");
  };

  const handleInputChange = (e) => {
    setInputs({
      ...inputs,
      [activeTab]: e.target.value,
    });

    setResult(null);
    setError("");
  };

  const handleQrFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      setQrFile(null);
      setQrPreview(null);
      return;
    }

    setError("");
    setResult(null);
    setQrFile(file);
    setQrPreview(URL.createObjectURL(file));
  };

  const clearQrFile = () => {
    setQrFile(null);
    setQrPreview(null);
    setResult(null);
    setError("");
  };

  const handleScan = async () => {
    if (activeTab === "qr") {
      if (!qrFile) {
        setError("Please upload a QR code image.");
        return;
      }
    } else {
      if (!currentValue.trim()) {
        setError(
          `Please enter a ${activeTab === "url" ? "URL" : "message"} to scan.`,
        );
        return;
      }
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      let res;

      if (activeTab === "qr") {
        res = await predictQr(qrFile);
      } else if (activeTab === "url") {
        res = await predictUrl(currentValue);
      } else {
        res = await predictMessage(currentValue);
      }

      const score = Math.round(Number(res.score || 0));

      setResult({
        score,
        riskLevel: getRiskLevel(score),
        verdict: res.verdict,
        confidence: res.confidence,
        prediction: res.prediction,
        model: res.model,
        flags: res.flags || [],
        input: res.input,
        decodedText: res.decoded_text,
        extractedUrl: res.extracted_url,
        safeProbability: res.safe_probability,
        phishingProbability: res.phishing_probability,
      });
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Scan failed. Make sure the FastAPI backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="scanner-page">
      <div className="scanner-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="scanner-header">
          <div className="scanner-badge">
            <Shield size={18} />
            AI Security Scanner
          </div>

          <h1>PhishWall Scanner</h1>

          <p>
            Scan URLs, SMS, emails, and QR codes for phishing or suspicious
            patterns using machine learning.
          </p>
        </div>

        <div className="scanner-card">
          <div className="scanner-tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => handleTabChange(tab.id)}
                  type="button"
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="scanner-input-section">
            <div className="input-heading">
              <h2>{activeTabData?.label} Scanner</h2>
              <p>{activeTabData?.description}</p>
            </div>

            {activeTab === "qr" ? (
              <div className="qr-upload-box">
                <label htmlFor="qr-file-input" className="qr-upload-label">
                  <Upload size={20} />
                  Upload QR Code Image
                </label>

                <input
                  id="qr-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleQrFileChange}
                  className="qr-file-input"
                />

                {qrPreview && (
                  <div className="qr-preview-wrapper">
                    <div className="qr-preview">
                      <img src={qrPreview} alt="QR preview" />
                    </div>

                    <button
                      type="button"
                      className="clear-qr-btn"
                      onClick={clearQrFile}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <textarea
                className="scanner-textarea"
                value={currentValue}
                onChange={handleInputChange}
                placeholder={activeTabData?.placeholder}
                rows={activeTab === "url" ? 4 : 8}
              />
            )}

            {error && <div className="error-box">{error}</div>}

            <button
              className="scan-btn"
              onClick={handleScan}
              disabled={loading}
              type="button"
            >
              {loading ? (
                <>
                  <Loader2 className="spin" size={20} />
                  Scanning...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Scan Now
                </>
              )}
            </button>
          </div>

          {result && (
            <div className={`result-card ${result.verdict}`}>
              <div className="result-top">
                {getResultIcon(result.verdict)}

                <div>
                  <h2>{result.prediction || "Scan Result"}</h2>
                  <p>{result.model}</p>
                </div>
              </div>

              <div className="score-section">
                <div className="score-circle">
                  <span>{result.score}%</span>
                  <small>Risk</small>
                </div>

                <div className="score-info">
                  <p>
                    <strong>Risk Level:</strong> {result.riskLevel}
                  </p>

                  <p>
                    <strong>Confidence:</strong>{" "}
                    {Number(result.confidence || 0).toFixed(2)}%
                  </p>

                  {result.safeProbability !== undefined && (
                    <p>
                      <strong>Safe Probability:</strong>{" "}
                      {Number(result.safeProbability).toFixed(2)}%
                    </p>
                  )}

                  {result.phishingProbability !== undefined && (
                    <p>
                      <strong>Phishing Probability:</strong>{" "}
                      {Number(result.phishingProbability).toFixed(2)}%
                    </p>
                  )}
                </div>
              </div>

              {activeTab === "qr" && (
                <div className="qr-result-details">
                  {result.decodedText && (
                    <p>
                      <strong>Decoded Text:</strong> {result.decodedText}
                    </p>
                  )}

                  {result.extractedUrl && (
                    <p>
                      <strong>Extracted URL:</strong> {result.extractedUrl}
                    </p>
                  )}
                </div>
              )}

              {result.input && activeTab !== "qr" && (
                <div className="input-result-details">
                  <p>
                    <strong>Scanned Input:</strong> {result.input}
                  </p>
                </div>
              )}

              {result.flags && result.flags.length > 0 && (
                <div className="flags-section">
                  <h3>Security Notes</h3>

                  <ul>
                    {result.flags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
