const handleRegisterUser = async (
    url: string,
    credentials: { username?: string; email?: string; password: string },
    setError: (message: string) => void,
    setSuccess: (message: string) => void
  ) => {
    try {
      const response = await fetch(`/api/user/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || `Failed to ${url}.`);
        return null;
      }
  
      const data = await response.json();
      console.log(`${url} successful.`, data.user);
      setSuccess(`${url} successful!`);
      return data;
    } catch (error) {
      console.error("Error:", error);
      setError("Network or server error");
      return null;
    }
  };
  
  export default handleRegisterUser;