import { useState } from "react";
import AnalyzerCard from "../components/AnalyzerCard";
import ResultPanel  from "../components/ResultPanel";
import "./Home.css";

export default function Home() {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="home-main">

      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">
          <span>●</span> Rishing India
        </div>
        <h1 className="hero-title">
          Fake News<br />Detector
        </h1>
        <p className="hero-sub">
          Paste any news article or headline and our ML models will
          analyze it for authenticity in seconds.
        </p>
      </div>

      {/* Main card */}
      <div className="detector-card">
        <AnalyzerCard onResult={setResult} onLoading={setLoading} />
        <ResultPanel  result={result} loading={loading} />
      </div>

    </main>
  );
}