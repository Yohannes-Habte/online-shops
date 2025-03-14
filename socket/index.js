import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();

// =============================================================================
// Create an HTTP server using Express
// =============================================================================
const server = http.createServer(app);

// =============================================================================
// Initialize Socket.io server and enable CORS with the client URL from .env
// =============================================================================
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

// Middleware to handle CORS and JSON request bodies
app.use(cors());
app.use(express.json());

// Check if the server is running
app.get("/server", (req, res) => {
  res.send("Soket.IO Server is running.");
});

// Array to store connected users
let users = [];

/**
 * Adds a user to the list if they are not already present
 * @param {string} userId - The ID of the user
 * @param {string} socketId - The socket ID of the user
 */
const addUser = (userId, socketId) => {
  const existingUser = users.find((user) => user.userId === userId);

  if (existingUser) {
    // Update socket ID if user already exists
    existingUser.socketId = socketId;
  } else {
    // Add new user
    users.push({ userId, socketId });
  }
};

/**
 * Removes a user from the list when they disconnect
 * @param {string} socketId - The socket ID of the user to remove
 */
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

/**
 * Retrieves a user by their userId
 * @param {string} receiverId - The ID of the receiver
 * @returns {object} - The user object if found
 */
const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

/**
 * Creates a message object
 * @param {object} messageData - The message details
 * @returns {object} - The message object
 */
const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

// =============================================================================
// Handle socket.io connections
// =============================================================================
io.on("connection", (socket) => {
  // When a user joins, add them to the users list
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // Store messages for temporary session (not persistent)
  const messages = {};

  /**
   * Handles sending messages between users
   */
  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });
    const user = getUser(receiverId);

    // Store messages for the receiver
    if (!messages[receiverId]) {
      messages[receiverId] = [message];
    } else {
      messages[receiverId].push(message);
    }

    // Send message to the receiver if they are online
    io.to(user?.socketId).emit("getMessage", message);
  });

  /**
   * Marks a message as seen
   */
  socket.on("messageSeen", ({ senderId, receiverId, conversationId }) => {
    const user = getUser(senderId);
    if (messages[senderId]) {
      const message = messages[senderId].find(
        (msg) => msg.receiverId === receiverId && msg.id === conversationId
      );
      if (message) {
        message.seen = true; // Mark message as seen
        io.to(user?.socketId).emit("messageSeen", {
          senderId,
          receiverId,
          conversationId,
        });
      }
    }
  });

  /**
   * Updates the last message for all users
   */
  socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
    io.emit("getLastMessage", { lastMessage, lastMessagesId });
  });

  /**
   * Handles user disconnection
   */
  socket.on("disconnect", () => {
    removeUser(socket.id); // Remove user from active list
    io.emit("getUsers", users); // Notify all clients about updated user list
  });
});

// Start the server on the specified port or default to 3000

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
