// createNewRoom.ts
import { useState } from "react";
import axios from "axios";
import "../../styles/CreateNewRoom.css";
import { Room } from "../../models/Room";

const CreateNewRoom = ({
  onRoomCreated,
}: {
  onRoomCreated: (room: Room) => void;
}) => {
  const [roomName, setRoomName] = useState<string>("");
  const [isRoomActive, setIsRoomActive] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setError("Room name cannot be empty");
      return;
    }

    try {
      // Kontrollera om rummet redan finns via API
      const existingRoomsResponse = await axios.get("/api/room/rooms"); // Hämtar befintliga rum
      const existingRooms = existingRoomsResponse.data;

      // Kontrollera om ett rum med samma namn redan finns (skiftlägesokänsligt)
      const roomExists = existingRooms.some(
        (room: Room) =>
          room.name.toLowerCase() === roomName.trim().toLowerCase()
      );

      if (roomExists) {
        setError(`A room with the name "${roomName}" already exists.`);
        return;
      }

      // Om rummet inte finns, skapa det
      const response = await axios.post("/api/room/addRoom", {
        name: roomName.trim(),
        isActive: isRoomActive,
      });

      const createdRoom = response.data; // API:s svar med det nya rummet
      onRoomCreated(createdRoom); // Skicka det nya rummet tillbaka till Channels
      setRoomName(""); // Rensa inputfält
      setError(null); // Rensa eventuella fel
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create room");
      console.error("Error creating room:", err);
    }
  };

  return (
    <div className="create-room-container">
      <h3>Create a New Room</h3>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="create-room-input"
      />
      <label className="lock-status">
        <input
          type="checkbox"
          checked={isRoomActive}
          onChange={(e) => setIsRoomActive(e.target.checked)}
        />
        {isRoomActive ? "Locked" : "Unlocked"}
      </label>
      <button onClick={handleCreateRoom} className="create-room-button">
        Create Room
      </button>
    </div>
  );
};

export default CreateNewRoom;