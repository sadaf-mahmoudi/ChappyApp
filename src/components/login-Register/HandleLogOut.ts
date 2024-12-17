const handleLogout = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        localStorage.removeItem("token"); // Adjust if using other storage for tokens
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };
  
  export default handleLogout;