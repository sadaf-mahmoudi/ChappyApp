import { Room } from "../models/Room.js";

export const roomList: Room[] = [
  // Updated room objects with new property names
  {
    name: "Enchanted Grove",
    isActive: true,
    imageUrl: "https://picsum.photos/200/200?random=10",
  },
  {
    name: "Whispering Pines",
    isActive: false,
    imageUrl: "https://picsum.photos/200/200?random=9",
  },
  {
    name: "Room 1",
    isActive: true,
    imageUrl: "https://picsum.photos/200/200?random=8",
  },
  {
    name: "Room 2",
    isActive: false,
    imageUrl: "https://picsum.photos/200/200?random=7",
  },
  {
    name: "Room 3",
    isActive: false,
    imageUrl: "https://picsum.photos/200/200?random=6",
  },
];