import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import chatRoutes from "./routes/chats.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import communityRoutes from './routes/communityRoutes.js';

import { connectDB } from "./lib/db.js";
import { Server } from "socket.io";
<<<<<<< HEAD
=======
import chat from "./models/chats.model.js";
import User from "./models/user.model.js";
import Post from "./models/post.model.js";
>>>>>>> 12898fe63615fee9a5fb315ac3f13e6171044237

// Resolve __dirname in ES Module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
<<<<<<< HEAD
const PORT = process.env.PORT || 8000;
=======
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
if (process.env.NODE_ENV !== "production") {
	const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

	app.use(cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true
	}));
}
>>>>>>> 12898fe63615fee9a5fb315ac3f13e6171044237

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:5173",
	credentials: true,
}));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);
<<<<<<< HEAD
app.use("/api/v1/community", communityRoutes);
=======
app.use("/api/v1/chats", chatRoutes);
// app.use("/api/v1/user", chatRoutes);

app.get("/getallusers", async (req, res)=>{
	const user = await User.find({});
    res.send(user)
})

app.get("/getallposts", async (req, res)=>{
	const posts = await Post.find({});
	res.send(posts)
})
>>>>>>> 12898fe63615fee9a5fb315ac3f13e6171044237

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Start server
const server = app.listen(PORT, () => {
	console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Setup Socket.io
const io = new Server(server, {
	pingTimeout: 60000,
	cors: {
<<<<<<< HEAD
		origin: "http://localhost:5173",
		credentials: true,
=======
	  origin: "http://localhost:5173"||"http://192.168.29.72:5173"||"http://localhost:3000",
	  // credentials: true,
>>>>>>> 12898fe63615fee9a5fb315ac3f13e6171044237
	},
});

io.on("connection", (socket) => {
	console.log("🔌 A user connected:", socket.id);

	socket.on("joinChat", ({ userId, otherUserId }) => {
		const room = [userId, otherUserId].sort().join("_");
		socket.join(room);
		console.log(`${userId} joined room: ${room}`);
	});

	socket.on("sendMessage", (messageData) => {
		const room = [messageData.senderId, messageData.receiverId].sort().join("_");
		io.to(room).emit("receiveMessage", messageData);
		console.log("📨 Message sent to room:", room, messageData);
	});

	socket.on("disconnect", () => {
		console.log("❌ A user disconnected:", socket.id);
	});
});
