import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "simple-peer";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneAlt,
  FaPaperPlane,
  FaHome,
  FaUsers,
  FaComments,
  FaDesktop,
  FaTimes
} from "react-icons/fa";
import "../styles.css";

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userVideo = useRef();
  const peerVideo = useRef();
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const [participantsVisible, setParticipantsVisible] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [screenSharing, setScreenSharing] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        const newPeer = new Peer({
          initiator: window.location.pathname.includes(roomId),
          trickle: false,
          stream,
        });

        newPeer.on("signal", (data) => {
          console.log("Signal received", data);
        });

        newPeer.on("stream", (remoteStream) => {
          if (peerVideo.current) {
            peerVideo.current.srcObject = remoteStream;
          }
        });

        setPeer(newPeer);

        setParticipants(["You"]);
      });

    return () => {
      cleanup();
    };
  }, [roomId]);

  const toggleMute = () => {
    setMuted(!muted);
    if (stream) {
      stream.getAudioTracks()[0].enabled = !muted;
    }
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    if (stream) {
      stream.getVideoTracks()[0].enabled = !videoEnabled;
    }
  };

  const cleanup = () => {
    if (peer) {
      peer.destroy();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const leaveCall = () => {
    cleanup();
    navigate("/");
  };

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { text: newMessage, sender: "You", time: new Date().toLocaleTimeString() },
      ]);
      setNewMessage("");
    }
  };

  const toggleChat = () => {
    setChatVisible(!chatVisible);
    setParticipantsVisible(false);
  };

  const toggleParticipants = () => {
    setParticipantsVisible(!participantsVisible);
    setChatVisible(false);
  };

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setStream(screenStream);
      if (userVideo.current) {
        userVideo.current.srcObject = screenStream;
      }
      setScreenSharing(true);
    } else {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(userStream);
      if (userVideo.current) {
        userVideo.current.srcObject = userStream;
      }
      setScreenSharing(false);
    }
  };

  return (
    <div className="video-call-container">
      <div className="left-icons">
        <button onClick={() => navigate("/")}>
          <FaHome />
        </button>
        <button onClick={toggleParticipants}>
          <FaUsers />
        </button>
        <button onClick={toggleScreenShare}>
          <FaDesktop />
        </button>
        <button onClick={toggleChat}>
          <FaComments />
        </button>
      </div>

      {/* Video Section */}
      <div className="video-section">
        <video ref={userVideo} autoPlay muted className="user-video" />
      </div>

      {/* Sidebar (Chat or Participants) */}
      {(chatVisible || participantsVisible) && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>{chatVisible ? "Messages" : "Participants"}</h3>
            <button className="close-btn" onClick={() => {
              setChatVisible(false);
              setParticipantsVisible(false);
            }}>
              <FaTimes />
            </button>
          </div>
          
          <div className="content">
            {chatVisible ? (
              <div className="message-list">
                {messages.map((msg, index) => (
                  <div key={index} className="message">
                    <strong>{msg.sender}:</strong> {msg.text} <span>{msg.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="participant-list">
                {participants.map((participant, index) => (
                  <li key={index}>{participant}</li>
                ))}
              </ul>
            )}
          </div>

          {chatVisible && (
            <div className="message-input-container">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={sendMessage}>
                <FaPaperPlane />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Controls */}
      <div className="controls">
        <button onClick={toggleMute}>{muted ? <FaMicrophoneSlash /> : <FaMicrophone />}</button>
        <button onClick={toggleVideo}>{videoEnabled ? <FaVideo /> : <FaVideoSlash />}</button>
        <button onClick={leaveCall} className="leave-btn">
          <FaPhoneAlt />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
