import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

let onlineUsers = [];

/**
 * Adds a user to the online users list or updates their socket ID if they already exist.
 * @param {string} userId - The ID of the user
 * @param {string} socketId - The socket ID of the user
 */
const addUser = (userId, socketId) => {
  if (!userId || !socketId) {
    console.log("❌ Missing userId or socketId in addUser");
    return;
  }

  let existingUser = onlineUsers.find((user) => user.userId === userId);

  if (existingUser) {
    console.log(`🔄 Updating socketId for user: ${userId}`);
    existingUser.socketId = socketId;
  } else {
    console.log(`➕ Adding new user: ${userId}`);
    onlineUsers.push({ userId, socketId });
  }
};

/**
 * Removes a user from the online users list when they disconnect.
 * @param {string} socketId - The socket ID of the user to remove
 */
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

/**
 * Retrieves a user by their userId.
 * @param {string} userId - The ID of the user to find
 * @returns {object} - The user object if found
 */
const getUser = (userId) => onlineUsers.find((user) => user.userId === userId);

/**
 * Creates a message object with the given details.
 * @param {object} messageData - The message details
 * @returns {object} - The formatted message object
 */
const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

io.on("connection", (socket) => {
  /**
   * Handles adding users to the online list when they connect.
   */
  socket.on("addUser", (userId) => {
    if (!userId) {
      console.log("⚠️ addUser called with invalid userId:", userId);
      return;
    }

    addUser(userId, socket.id);
    io.emit("getUsers", onlineUsers);
  });

  // Temporary storage for messages
  const messages = {};

  /**
   * Handles sending messages between users.
   */
  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    console.log(
      "✅ Final Online Users List:",
      JSON.stringify(onlineUsers, null, 2)
    );

    const message = createMessage({ senderId, receiverId, text, images });
    const receiver = getUser(receiverId);
    console.log("receiver:", receiver);

    if (!receiver) {
      console.log(`❌ Receiver (ID: ${receiverId}) not found.`);
      return;
    }

    console.log("🔍 Checking messages for receiverId:", receiverId);
    console.log("Existing messages:", messages[receiverId]);

    // Ensure messages object is initialized for the receiver
    if (!messages[receiverId]) {
      messages[receiverId] = [];
    }

    console.log("📩 Adding message to existing conversation.", message);
    messages[receiverId].push(message);

    io.to(receiver.socketId).emit("getMessage", message);
  });

  /**
   * Marks a message as seen and notifies the sender.
   */
  socket.on("messageSeen", ({ senderId, receiverId, conversationId }) => {
    const user = getUser(senderId);
    if (messages[senderId]) {
      const message = messages[senderId].find(
        (msg) => msg.receiverId === receiverId && msg.id === conversationId
      );
      if (message) {
        message.seen = true;
        io.to(user?.socketId).emit("messageSeen", {
          senderId,
          receiverId,
          conversationId,
        });
      }
    }
  });

  /**
   * Updates the last message for all users.
   */
  socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
    io.emit("getLastMessage", { lastMessage, lastMessagesId });
  });

  /**
   * Handles user disconnection and removes them from the online users list.
   */
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", onlineUsers);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
