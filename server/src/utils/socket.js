const socket = require("socket.io")
const crypto = require("crypto")
const { Chat } = require("../models/chat")
const ConnectionRequest = require("../models/connectionRequest")

const getSecretRoomId = (userId, targetUserId) => {
	return crypto
		.createHash("sha256")
		.update([userId, targetUserId].sort().join("$"))
		.digest("hex")
}

// ✅ Store canvas data in-memory (can use Redis later)
const drawingRoomData = {}

const initializeSocket = (server) => {
	const io = socket(server, {
		cors: {
			origin: "http://localhost:5173", // Adjust frontend port if needed
			methods: ["GET", "POST"],
		},
	})

	io.on("connection", (socket) => {
		// ✅ Chat feature
		socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
			const roomId = getSecretRoomId(userId, targetUserId)
			console.log(firstName + " joined Chat Room: " + roomId)
			socket.join(roomId)
		})

		socket.on(
			"sendMessage",
			async ({ firstName, lastName, userId, targetUserId, text }) => {
				try {
					const roomId = getSecretRoomId(userId, targetUserId)
					console.log(firstName + " says:", text)

					let chat = await Chat.findOne({
						participants: { $all: [userId, targetUserId] },
					})

					if (!chat) {
						chat = new Chat({
							participants: [userId, targetUserId],
							messages: [],
						})
					}

					chat.messages.push({ senderId: userId, text })
					await chat.save()

					io.to(roomId).emit("messageReceived", {
						firstName,
						lastName,
						text,
					})
				} catch (err) {
					console.error("Message error:", err)
				}
			}
		)

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

		socket.on("disconnect", () => {
			console.log("Client disconnected:", socket.id)
		})
	})
}

module.exports = initializeSocket
