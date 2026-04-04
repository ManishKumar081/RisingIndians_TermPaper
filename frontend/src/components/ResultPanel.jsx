import "./ResultPanel.css";

export default function ResultPanel({ result }) {
  if (!result) return null;

  const isFake = result.label === "FAKE";

  return (
    <div className="result-root">
      <hr className="result-divider" />

      <div className="result-body">

        {/* Header */}
        <div className="result-header">
          <span className="result-title-label">Analysis Result</span>
          <span className="model-used-tag">{result.model}</span>
        </div>

        {/* Grid */}
        <div className="result-grid">

          {/* Verdict */}
          <div className={`verdict-card ${isFake ? "fake" : "real"}`}>
            <div className={`verdict-label ${isFake ? "fake" : "real"}`}>
              {isFake ? "FAKE" : "REAL"}
            </div>
            <div className="verdict-confidence">
              Confidence:{" "}
              <strong>{(result.confidence * 100).toFixed(1)}%</strong>
            </div>
          </div>

          {/* Probability bars */}
          <div className="prob-card">
            <span className="prob-card-title">Probability Breakdown</span>
            <ProbRow label="Fake" value={result.fake_probability} type="fake" />
            <ProbRow label="Real" value={result.real_probability} type="real" />
          </div>
        </div>

        {/* Timing */}
        {result.processingMs != null && (
          <div className="timing-row">
            <span>⚡</span> Processed in {result.processingMs}ms
          </div>
        )}
      </div>
    </div>
  );
}

function ProbRow({ label, value, type }) {
  return (
    <div className="prob-row">
      <div className="prob-row-labels">
        <span className="prob-name">{label} probability</span>
        <span className="prob-value">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="prob-bar-track">
        <div
          className={`prob-bar-fill ${type}`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}