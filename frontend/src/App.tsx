import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Counter from "./pages/Counter/Counter";
import Webcam from "./pages/Webcam/Webcam";
import Canvas from "./pages/Canvas/Canvas";
import Navbar from "./components/Navbar/Navbar";

import "./App.css";

function AppContent() {
  const [bags, setBags] = useState(0);
  const location = useLocation();
  const { bags: routeBags } = location.state || { bags: 0 };

  // Update bags state when route changes
  useEffect(() => {
    if (routeBags !== undefined) {
      setBags(routeBags);
    }
  }, [routeBags]);

  return (
    <>
      <Navbar bags={bags} />
      <Routes>
        <Route path="/" element={<Counter bags={bags} setBags={setBags} />} />
        <Route path="/webcam" element={<Webcam bags={bags} />} />
        <Route path="/canvas" element={<Canvas bags={bags} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
