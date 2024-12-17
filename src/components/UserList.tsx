import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserList.css";

const UserList = () => {
  const [users, setUsers] = useState<{ username: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/user"); // Din backend-endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const startChat = (username: string) => {
    navigate(`/dm/${username}`); // Navigera till DM-chatten med vald användare
  };

  return (
    <div className="user-list-container">
      <h2>Start a New Chat</h2>
      {loading && <p>Loading users...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.username}>
            <button onClick={() => startChat(user.username)}>
              Chat with {user.username}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;