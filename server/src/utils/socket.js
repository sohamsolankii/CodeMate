const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const initializeSocket = (server) => {
  const getSecretRoomId = (userId, targetUserId) => {
    return crypto
      .createHash("sha256")
      .update([targetUserId, userId].sort().join("$"))
      .digest("hex");
  };

  const io = socket(server, {
    cors: {
      origin: "https://connectsy.vercel.app",
      credentials: true
    },
  });

  // Store online users
  const onlineUsers = {};
  const drawingRoomData = {}


  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      onlineUsers[userId] = socket.id;

      // Notify all clients that this user is online
      io.emit("userStatus", { userId, status: "online" });
    }

    // Join private room
    socket.on("joinChat", ({ targetUserId, userId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    // Handle sending messages
    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
      try {
        const roomId = getSecretRoomId(userId, targetUserId);

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
        });

        await chat.save();

        io.to(roomId).emit("messageReceived", { firstName, lastName, text, createdAt: new Date() });
      } catch (error) {
        console.log("Send Message Error:", error.message);
      }
    });

    		// ✅ Drawing feature
		socket.on("joinRoom", ({ roomId, userId }) => {
			console.log(`User ${userId} joined Drawing Room: ${roomId}`)
			socket.join(roomId)

			if (!drawingRoomData[roomId]) drawingRoomData[roomId] = []

			// Send existing drawings to new user
			socket.emit("initialData", drawingRoomData[roomId])
		})

		socket.on("draw", (data) => {
			const { roomId } = data
			if (!drawingRoomData[roomId]) drawingRoomData[roomId] = []
			drawingRoomData[roomId].push(data)

			socket.to(roomId).emit("draw", data)
		})

		socket.on("clearCanvas", (roomId) => {
			drawingRoomData[roomId] = []
			io.to(roomId).emit("clearCanvas")
		})

		socket.on("toolChange", ({ roomId, tool, value }) => {
			socket.to(roomId).emit("toolChange", { tool, value })
		})

    // Handle disconnect
    socket.on("disconnect", () => {
      if (userId && onlineUsers[userId]) {
        delete onlineUsers[userId];

        // Notify all clients that this user is offline
        io.emit("userStatus", { userId, status: "offline" });
      }
    });
  });
};

module.exports = initializeSocket;
