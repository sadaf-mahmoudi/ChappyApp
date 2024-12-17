import "../../styles/Room.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRooms } from "./getAllRooms"; // Import your API call function
import { Room } from "../../models/Room";

const RoomList = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all rooms when the component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      const fetchedRooms = await getAllRooms();
      if (fetchedRooms) {
        setRooms(fetchedRooms);
      } else {
        setError("Failed to load rooms.");
      }
    };
    fetchRooms();
  }, []);

  // Get user role from local storage
  const userRole = localStorage.getItem("userRole");

  const handleRoomClick = (room: Room) => {
    if (room.isActive && userRole === "guest") {
      setError("This room is locked. Please log in to access it.");
    } else {
      setError(""); // Clear any previous errors
      navigate(`/room/${room.name}`); // Navigate to the room if not locked or if the user is logged in
    }
  };

  return (
    <div className="room-list">
      <h2>Available Rooms</h2>
      {rooms.map((room) => (
        <div key={room.name} className="room-item">
          <span
            className={`room-name ${room.isActive ? "locked" : ""}`}
            onClick={() => handleRoomClick(room)}
          >
            {room.name} {room.isActive && "(Locked)"}
          </span>
        </div>
      ))}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RoomList;