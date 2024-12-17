import { useState } from "react";
import handleLogin from "./HandleLogin";
import GuestLoginButton from "./GuestLogin.js";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"; // Importera useUser
import "../../styles/Loging.css";

const Login = () => {
  const { setUser } = useUser(); // Hämta setUser från UserContext
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const onLogin = async () => {
    setError("");
    setSuccess("");

    // Call handleLogin to process the login
    const result = await handleLogin(
      username,
      password,
      navigate,
      setError,
      setSuccess
    );

    // If login is successful, update the UserContext
    if (result.success && result.user) {
      setSuccess(result.message);
      setUser(result.user); // Set the user information in UserContext
      navigate("/channel"); // Navigate to the channel page
      // navigate("/dm"); // Navigate to the dm/users page
    } else {
      setError(result.message);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="main-form">
      <h2>Login</h2>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="form-control"
        />
      </div>
      <div className="main-login-btn"></div>
      <button
        onClick={onLogin}
        className="login-btn"
        disabled={!username || !password}
      >
        Login
      </button>
      <GuestLoginButton />
      <h2 className="reg-link" onClick={handleRegister}>
        Create account
      </h2>
      <div className="errorMain">
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default Login;