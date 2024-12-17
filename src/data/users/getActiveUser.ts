export const getActiveUser = async (): Promise<string | null> => {
    const token = localStorage.getItem("token"); // Hämta token från localStorage eller annan lagringslösning
    if (!token) return null;
  
    try {
      const response = await fetch("/api/user/activeuser", {
        headers: {
          Authorization: `Bearer ${token}`, // Skicka token som en Bearer-token
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.userId; // eller data.username beroende på vad API:et returnerar
      }
    } catch (error) {
      console.error("Failed to fetch active user:", error);
    }
    return null;
  };