import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home.js";
import VideoCall from "./components/VideoCall.js";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<VideoCall />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);
