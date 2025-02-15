import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="home-container">
      <div className="overlay">
        <h1 className="home-title">Welcome to Video Call App</h1>
        <p className="home-subtitle">Join a room and start your call instantly</p>
        <div className="input-container">
          <input
            type="text"
            className="room-input"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button className="join-btn" onClick={joinRoom}>
            Join Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
