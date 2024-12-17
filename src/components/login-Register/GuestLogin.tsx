import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const GuestLoginButton = () => {
  const { setUser, setIsGuest } = useUser();
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    setUser({ username: "Guest", role: "guest" }); // Lägg till 'role'
    setIsGuest(true);
    localStorage.setItem("username", "Guest");
    navigate("/guestchatPage");
  };

  return (
    <button onClick={handleGuestLogin} className="guest-login-btn">
      Login as Guest
    </button>
  );
};

export default GuestLoginButton;