import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FaTrash } from "react-icons/fa";
import "../styles/DMList.css";
import "../styles/sharedStyles.css";

const DMList = () => {
  const [dmList, setDmList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dmToDelete, setDmToDelete] = useState<string | null>(null); // Håller chatten som ska raderas
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDMList = async () => {
      try {
        const response = await fetch(
          `/api/dm/dm-list?username=${user?.username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch DM list");
        }
        const data = await response.json();
        setDmList(data);
      } catch (err) {
        setError("Error fetching DM list");
        console.error(err);
      }
    };

    if (user?.username) {
      fetchDMList();
    }
  }, [user]);

  const openChat = (recipientName: string) => {
    navigate(`/dm/${recipientName}`);
  };

  const deleteDMChat = async (recipientName: string) => {
    try {
      const response = await fetch(
        `/api/dm/delete?username=${user?.username}&recipient=${recipientName}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete DM chat");
      }
      setDmList((prevDMList) =>
        prevDMList.filter((name) => name !== recipientName)
      ); // Uppdatera DM-listan lokalt
      setDmToDelete(null); // Stäng dialogen
    } catch (err) {
      setError("Error deleting DM chat");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2 className="dm-title">Your Conversations</h2>
      <button className="new-chat-button" onClick={() => navigate("/new-chat")}>
        New Chat
      </button>
      {error && <p className="error-message">{error}</p>}
      <ul className="dm-list">
        {dmList.map((name) => (
          <li key={name} className="dm-item">
            <span className="dm-link" onClick={() => openChat(name)}>
              Chat with {name}
            </span>
            <FaTrash
              className="delete-icon"
              onClick={() => setDmToDelete(name)} // Sätt DM att radera
              title="Delete Chat"
            />
          </li>
        ))}
      </ul>

      {/* Bekräftelsedialog */}
      {dmToDelete && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to delete the chat with "{dmToDelete}"?</p>
          <button
            onClick={() => deleteDMChat(dmToDelete)}
            className="confirm-button"
          >
            Yes
          </button>
          <button
            onClick={() => setDmToDelete(null)} // Avbryt
            className="cancel-button"
          >
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default DMList;