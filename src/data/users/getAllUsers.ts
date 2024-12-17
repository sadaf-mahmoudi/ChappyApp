// import { User } from "../data/models/User";

// export async function getAllUsers(): Promise<User[] | null> {
//     try {
//         const response = await fetch("/api/users", { method: "GET" });
//         if (!response.ok) {
//             console.error("Failed to fetch rooms, status:", response.status);
//             return null;
//         }

//         const users: User[] = await response.json();

//         return (users)

//     } catch (error) {
//         console.error("Error fetching rooms:", error);
//         return null
//     }

// }