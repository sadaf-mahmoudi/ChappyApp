import { createHashRouter } from "react-router-dom";
import Root from "./Root";
import App from "../App";
import Login from "../components/login-Register/Login";
import Register from "../components/login-Register/Register";
import GuestChatPage from "../components/GuestChatRoom"; // Adjust the path if needed
import Channel from "../components/Channels";
import UserChatRoom from "../components/userChatRoom";
import DMChat from "../components/DMChat";
import UserList from "../components/UserList";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <App /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/channel", element: <Channel /> },
      { path: "/room/:roomId", element: <UserChatRoom /> },
      { path: "/dm/:recipientName", element: <DMChat /> },
      { path: "/guestchatPage", element: <GuestChatPage /> },
      { path: "/new-chat", element: <UserList /> },
    ],
  },
]);

export { router };