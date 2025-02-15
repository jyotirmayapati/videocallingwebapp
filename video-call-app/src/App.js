import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.js";
import VideoCall from "./components/VideoCall.js";
import "./styles.css";
import process from "process";
window.process = process;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/call/:roomId" element={<VideoCall />} />
      </Routes>
    </Router>
  );
}

export default App;
