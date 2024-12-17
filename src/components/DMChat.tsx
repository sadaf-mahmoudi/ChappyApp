import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/ChatRoom.css";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

const DMChat = () => {
  const { recipientName } = useParams<{ recipientName: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const messageDivRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/dm/between?user1=${user?.username}&user2=${recipientName}`
        );
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [user, recipientName]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.username || !recipientName) return;

    const newMessageData = {
      senderName: user.username,
      receiverName: recipientName,
      textMessage: newMessage,
    };

    try {
      const response = await fetch("/api/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessageData),
      });

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { ...newMessageData, date: new Date() },
        ]);
        setNewMessage("");
        messageDivRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handleBack = () => {
    navigate("/channel");
  };

  return (
    <div className="chat-room-container">
      <div className="back-button" onClick={handleBack}>
        <FaArrowLeft />
        Back
      </div>
      <h2 className="chat-title">Chat with {recipientName}</h2>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-item ${
              msg.senderName === user?.username ? "own" : ""
            }`}
          >
            <div className="message-sender">{msg.senderName}</div>
            <div>{msg.textMessage}</div>
            <div className="message-timestamp">
              {new Date(msg.date).toLocaleString()}
            </div>
          </div>
        ))}
        <div ref={messageDivRef} />
      </div>
      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="send-button" onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default DMChat;