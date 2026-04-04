import { useState, useRef } from "react";
import "./AnalyzerCard.css";

const MODELS = [
  { id: "hybrid",              label: "Hybrid (Best)" },
  { id: "logistic_regression", label: "Logistic Reg." },
  { id: "naive_bayes",         label: "Naive Bayes"   },
  { id: "svm",                 label: "SVM"           },
];

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AnalyzerCard({ onResult, onLoading }) {
  const [title,   setTitle]   = useState("");
  const [text,    setText]    = useState("");
  const [model,   setModel]   = useState("hybrid");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const textRef = useRef();

  const handleAnalyze = async () => {
    if (!text.trim()) { textRef.current?.focus(); return; }

    setLoading(true);
    setError(null);
    onLoading(true);
    onResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), title: title.trim(), model }),
      });
      const data = await res.json();
      if (data.status === "error") throw new Error(data.message);
      onResult({ ...data.prediction, processingMs: data.processing_time_ms });
    } catch (err) {
      setError(err.message || "Could not reach the API. Is Flask running on port 5000?");
      onResult(null);
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  return (
    <div className="analyzer-body">

      {/* Model selector */}
      <span className="field-label">Select Model</span>
      <div className="model-row">
        {MODELS.map((m) => (
          <button
            key={m.id}
            className={`model-chip ${model === m.id ? "active" : ""}`}
            onClick={() => setModel(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Title */}
      <span className="field-label">
        Headline / Title <span className="optional">(optional)</span>
      </span>
      <input
        className="field-input"
        placeholder="e.g. Scientists discover new planet..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Article body */}
      <span className="field-label">Article Body</span>
      <div className="textarea-wrapper">
        <textarea
          ref={textRef}
          className="field-textarea"
          placeholder="Paste the full news article text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <span className="char-count">{text.length.toLocaleString()} chars</span>
      </div>

      {/* Error */}
      {error && (
        <div className="error-box">
          <span>⚠</span> {error}
        </div>
      )}

      {/* Submit */}
      <button
        className="analyze-btn"
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
      >
        {loading
          ? <><div className="spinner" /> Analyzing…</>
          : <><span>🔍</span> Analyze Article</>
        }
      </button>
    </div>
  );
}