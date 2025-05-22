import { BrowserRouter, Routes, Route } from "react-router-dom";
import Counter from "./pages/Counter/Counter";
import Webcam from "./pages/Webcam/Webcam";
import Canvas from "./pages/Canvas/Canvas";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Counter />} /> */}
        <Route path="/" element={<Webcam />} />
        <Route path="/canvas" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
