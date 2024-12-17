import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRoomMessages } from "../data/chat/fetchRoomsMessages";
import { postNewMessage } from "../data/chat/postRoomsMessages";
import { getAllRooms } from "../data/rooms/getAllRooms";
import { RoomMessage } from "../models/RoomMessage";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import "../styles/ChatRoom.css";

const RoomChat = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [roomName, setRoomName] = useState<string>("Loading...");
  const messageDivRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchRoomName = async () => {
      try {
        const rooms = await getAllRooms();
        const currentRoom = rooms?.find((room) => room._id === roomId);
        setRoomName(currentRoom?.name || "Unknown Room");
      } catch (error) {
        console.error("Error fetching room name:", error);
        setRoomName("Unknown Room");
      }
    };

    if (roomId) fetchRoomName();
  }, [roomId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await fetchRoomMessages(roomId!);
        if (fetchedMessages) {
          setMessages(fetchedMessages);
          scrollToBottom();
        } else {
          setError("Failed to load messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to load messages");
      }
    };

    if (roomId) fetchMessages();
  }, [roomId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user?.username || !roomId) return;

    const newMessage = {
      senderName: user.username,
      messageText: messageInput,
      roomName: roomId,
      date: new Date(),
    };

    try {
      const responseMessage = await postNewMessage(newMessage);
      if (responseMessage) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...newMessage, _id: responseMessage._id },
        ]);
        setMessageInput("");
        scrollToBottom();
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    if (messageDivRef.current) {
      messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
    }
  };

  const handleBack = () => {
    navigate("/channel");
  };

  return (
    <div className="chat-room-container">
      <div className="chat-header">
        <div className="back-button" onClick={handleBack}>
          <FaArrowLeft />
          Back
        </div>
        <h2 className="chat-title">Room: {roomName}</h2>
      </div>
      <div className="messages-container" ref={messageDivRef}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id}
              className={`message-item ${
                message.senderName === user?.username ? "own" : ""
              }`}
            >
              <div className="message-sender">{message.senderName}</div>
              <div>{message.messageText}</div>
              <div className="message-timestamp">
                {new Date(message.date).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <p>No messages in this room yet.</p>
        )}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="send-button" onClick={handleSendMessage}>
          <FaPaperPlane />
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RoomChat;