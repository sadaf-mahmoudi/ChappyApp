import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Room } from "../models/Room";
import { FaLock, FaLockOpen, FaTrash } from "react-icons/fa";
import DMList from "./DMList";
import CreateRoomForm from "../data/rooms/createNewRoom"; // Importera CreateRoomForm
import deleteRoom from "../data/rooms/deleteRoom"; // Importera deleteRoom
import "../styles/DMList.css";
import "../styles/sharedStyles.css";

const Channels = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [, setLockedRoomId] = useState<string | null>(null);
  const [showCreateRoomModal, setShowCreateRoomModal] =
    useState<boolean>(false); // Modal toggle
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const { isGuest, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`/api/room/rooms`);
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError("Error fetching rooms");
        console.error(err);
      }
    };

    fetchRooms();
  }, []);

  // Enter a room (handles guest restrictions)
  const enterRoom = (roomId: string, isLocked: boolean) => {
    if (isGuest && isLocked) {
      setLockedRoomId(roomId);
    } else {
      navigate(`/room/${roomId}`);
    }
  };

  // Confirm delete room
  const confirmDeleteRoom = (room: Room) => {
    setRoomToDelete(room);
  };

  // Handle room deletion
  const handleRoomDelete = (deletedRoomId: string) => {
    setRooms((prevRooms) =>
      prevRooms.filter((room) => room._id !== deletedRoomId)
    ); // Ta bort rummet från listan
    setRoomToDelete(null); // Stäng dialogen
  };

  // Handle delete error
  const handleDeleteError = (error: string) => {
    setError(error);
    setRoomToDelete(null); // Stäng dialogen
  };

  // Add newly created room to list
  const handleRoomCreated = (newRoom: Room) => {
    setRooms((prevRooms) => [...prevRooms, newRoom]); // Uppdatera rooms-state
    setShowCreateRoomModal(false); // Stäng modalen
  };

  return (
    <div className="container">
      <h2 className="channels-title">Channels</h2>
      {error && <p className="error-message">{error}</p>}

      {!isGuest && (
        <button
          onClick={() => setShowCreateRoomModal(true)}
          className="create-room-modal-button"
        >
          Create New Room
        </button>
      )}

      <ul className="channel-list">
        {rooms.map((room) => (
          <li key={room._id} className="channel-item">
            <span
              onClick={() => enterRoom(room._id, room.isActive)}
              className={`channel-link ${
                room.isActive && isGuest ? "locked" : "open"
              }`}
            >
              {room.name}{" "}
              {room.isActive && isGuest ? (
                <FaLock className="lock-icon" />
              ) : (
                <FaLockOpen className="lock-icon open-icon" />
              )}
            </span>

            {!isGuest && (
              <>
                <FaTrash
                  className="delete-icon"
                  onClick={() => confirmDeleteRoom(room)}
                  title="Delete Channel"
                />
              </>
            )}
          </li>
        ))}
      </ul>

      {!isGuest && user && <DMList />}

      {/* Confirmation Dialog */}
      {roomToDelete && (
        <div className="confirmation-dialog">
          <p>
            Are you sure you want to delete the channel "{roomToDelete.name}"?
          </p>
          <button
            onClick={() =>
              deleteRoom({
                roomToDelete,
                onSuccess: handleRoomDelete,
                onError: handleDeleteError,
              })
            }
            className="confirm-button"
          >
            Yes
          </button>
          <button
            onClick={() => setRoomToDelete(null)}
            className="cancel-button"
          >
            No
          </button>
        </div>
      )}
      {showCreateRoomModal && (
        <div className="modal">
          <div className="modal-content">
            <button
              onClick={() => setShowCreateRoomModal(false)}
              className="close-modal"
            >
              {" "}
              ×
            </button>
            <CreateRoomForm onRoomCreated={handleRoomCreated} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Channels;