import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH || "/socket.io";
const SOCKET_NAMESPACE = import.meta.env.VITE_SOCKET_NAMESPACE || "";

let socket;

export const getSocket = () => {
  if (!SOCKET_URL) {
    return null;
  }

  if (!socket) {
    socket = io(`${SOCKET_URL}${SOCKET_NAMESPACE}`, {
      autoConnect: false,
      path: SOCKET_PATH,
      transports: ["websocket", "polling"],
    });
  }

  const token = localStorage.getItem("token");
  socket.auth = token ? { token } : {};

  return socket;
};

export const connectSocket = () => {
  const activeSocket = getSocket();

  if (activeSocket && !activeSocket.connected) {
    activeSocket.connect();
  }

  return activeSocket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};
