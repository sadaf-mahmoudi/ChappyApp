export const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/user/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      return response; // Returnera response för att hantera statuskoder i komponenten
    } catch (error) {
      console.error("Error deleting user: ", error);
      throw error; // Kasta fel för att kunna fånga upp det i komponenten
    }
  };