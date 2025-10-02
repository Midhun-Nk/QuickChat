// Importing dependencies
import express from 'express'          // Web framework for Node.js
import 'dotenv/config'                 // Loads environment variables from .env
import cors from 'cors'                // Allows cross-origin requests
import http from 'http'                // Required to create a server manually
import connectDB from './lib/db.js'    // Your database connection function
import userRouter from './routes/userRoutes.js'   // User routes (auth etc.)
import messageRouter from './routes/messageRoute.js' // Message routes
import { Server } from 'socket.io'     // Socket.io for realtime communication

// Create express app
const app = express()

// Create HTTP server and attach socket.io to it
const server = http.createServer(app)

// Initialize socket.io with CORS enabled
export const io = new Server(server, {
    cors: {
        origin: "*" // Allow requests from any origin
    }
})

// Object to track which users are connected and their socket IDs
export const userSocketmap = {};

// Handle socket.io connections
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; // Expecting userId in handshake query
    console.log("user connected", userId);

    // If userId exists, map it to the current socket ID
    if (userId) userSocketmap[userId] = socket.id;

    // Broadcast the list of online users to everyone
    io.emit('getOnlineUsers', Object.keys(userSocketmap));

    // ❌ BUG: you wrote 'diconnect' (typo)
    // This event will never trigger as it's spelled wrong
    socket.on('disconnect', () => {
        console.log('User disconnected', userId);

        // Remove user from map
        delete userSocketmap[userId];

        // Broadcast updated list of online users
        io.emit('getOnlineUsers', Object.keys(userSocketmap));
    });
});

// Middleware setup
app.use(express.json({ limit: '4mb' })) // Parse JSON bodies with max size 4MB
app.use(cors()) // Enable cross-origin requests

// Health check route (to check if server is alive)
app.use('/api/status', (req, res) => {
    res.send("Server is live")
})

// Mount routers
app.use('/api/auth', userRouter)       // All routes related to auth will start with /api/auth
app.use('/api/messages', messageRouter) // All routes related to messages will start with /api/messages

// Define port
const PORT = process.env.PORT || 5000

// Connect to database before starting server
await connectDB()

// Start server
server.listen(PORT, () => {
    console.log("server is running on port:", PORT)
})
