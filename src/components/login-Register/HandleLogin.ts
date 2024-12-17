import { NavigateFunction } from "react-router-dom";

interface LoginResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    role: string;
    username: string;
  };
}

const handleLogin = async (
  username: string,
  password: string,
  navigate: NavigateFunction,
  setError: (message: string) => void,
  setSuccess: (message: string) => void
): Promise<LoginResult> => {
  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message || "Login failed.");
      return { success: false, message: errorData.message || "Login failed." };
    }

    const data = await response.json();
    if (data.user) {
      navigate("/channel");
      setSuccess("Login successful!");
      return {
        success: true,
        message: "Login successful!",
        user: {
          id: data.user.id, // Se till att dessa värden är definierade i ditt API-svar
          role: data.user.role,
          username: data.user.username,
        },
      };
    } else {
      setError("Login failed, no user data.");
      return { success: false, message: "Login failed, no user data." };
    }
  } catch (error) {
    console.error("Login error:", error);
    setError("Network or server error");
    return { success: false, message: "An error occurred during login." };
  }
};

export default handleLogin;