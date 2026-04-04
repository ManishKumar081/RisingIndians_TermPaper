import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home  from "./pages/Home";
import About from "./pages/About";   // ← add this
import "./App.css";

export default function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <Routes>
        <Route path="/"      element={<Home />}  />
        <Route path="/about" element={<About />} />  {/* ← update this */}
      </Routes>
    </div>
  );
}