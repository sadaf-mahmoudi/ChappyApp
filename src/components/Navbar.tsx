import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { deleteUser } from "../data/users/deleteUser";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, setUser, setIsGuest } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isGuest");
    navigate("/login");
  };

  const handleDeleteUser = async () => {
    if (!user || !user.id) {
      console.log("User ID is missing.");
      return;
    }
    try {
      const response = await deleteUser(user.id);
      if (response.ok) {
        console.log("User deleted successfully");
        handleLogout(); // Logga ut användaren efter att kontot har tagits bort
      } else {
        console.log("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">Chappy</h1>
      {user && (
        <div className="user-dropdown">
          <span onClick={() => setShowDropdown(!showDropdown)}>
            {user.username} ▼
          </span>
          {showDropdown && (
            <ul className="dropdown-menu">
              <li onClick={() => setShowDeleteConfirmation(true)}>
                Delete User
              </li>
              <li onClick={handleLogout}>Logout</li>
            </ul>
          )}
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to delete your account?</p>
          <button onClick={handleDeleteUser} className="confirm-button">
            Yes
          </button>
          <button
            onClick={() => setShowDeleteConfirmation(false)}
            className="cancel-button"
          >
            No
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;