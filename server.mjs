import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);
  // Join a dynamic room
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
    socket.emit("joined-room", `Joined room: ${room}`);
  });

  // Send message to a specific room
  socket.on("send-message", ({ room, message }) => {
    console.log(`Message to ${room}:`, message);
    io.to(room).emit("send-message", { sender: socket.id, message });
  });

  // Leave a room
  socket.on("leave-room", (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room: ${room}`);
    socket.emit("left-room", `Left room: ${room}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3077, () => {
  console.log(`Socket.IO server running on port 3077`);
});
