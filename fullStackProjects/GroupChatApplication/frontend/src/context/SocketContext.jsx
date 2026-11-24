import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      setSocket(null);
      setIsConnected(false);
      return;
    }

    // Retrieve JWT from the same storage used by Axios.
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Socket initialization failed: JWT not found");
      return;
    }

    console.log("Initializing Socket.IO...");

    const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token,
      },
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }

  return context;
};
