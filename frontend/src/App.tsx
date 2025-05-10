import { BrowserRouter, Routes, Route } from "react-router-dom";
import Counter from "./pages/Counter/Counter";
import Webcam from "./pages/Webcam/Webcam";
import Canvas from "./pages/Canvas/Canvas";
import Navbar from "./components/Navbar/Navbar"

import "./App.css";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Counter />} />
        <Route path="/webcam" element={<Webcam />} />
        <Route path="/canvas" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
