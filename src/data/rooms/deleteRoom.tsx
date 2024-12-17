// src/data/rooms/deleteRoom.tsx
import { Room } from "../../models/Room";

interface DeleteRoomProps {
  roomToDelete: Room;
  onSuccess: (deletedRoomId: string) => void;
  onError: (error: string) => void;
}

const deleteRoom = async ({
  roomToDelete,
  onSuccess,
  onError,
}: DeleteRoomProps) => {
  try {
    const response = await fetch(`/api/room/${roomToDelete._id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete room");
    }

    onSuccess(roomToDelete._id); // Skicka tillbaka det borttagna rummets ID till parent-komponenten
  } catch (err: any) {
    onError(err.message); // Skicka felmeddelande till parent-komponenten
  }
};

export default deleteRoom;