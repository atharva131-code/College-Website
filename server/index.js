import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import authRoutes from './routes/auth.js'
import announcementRoutes from './routes/announcements.js'
import resultRoutes from './routes/results.js'
import syllabusRoutes from './routes/syllabus.js'
import newsRoutes from './routes/news.js'
import courseRoutes from './routes/courses.js'
import eventRoutes from './routes/events.js'
import feeRoutes from './routes/fees.js'
import userRoutes from './routes/users.js'
import chatRoutes from './routes/chat.js'
import Message from './models/Message.js'

dotenv.config()

const app = express()

// Create HTTP server
const httpServer = createServer(app)

// Create Socket.IO server

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
})

// Security
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}))

// CORS
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true) // allow all origins
  },
  credentials: true,
}))

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth requests, please try again later.' }
})

app.use('/api/', limiter)
app.use('/api/auth/', authLimiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/results', resultRoutes)
app.use('/api/syllabus', syllabusRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/fees', feeRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'College Website API is running!' })
})

// Track online users per room
const roomUsers = {}

// Socket.IO connection
io.on('connection', (socket) => {
  console.log(' User connected:', socket.id)

  socket.on('join_room', ({ room, userName }) => {
    socket.join(room)
    socket.data.userName = userName
    socket.data.room = room

    if (!roomUsers[room]) roomUsers[room] = []
    if (!roomUsers[room].includes(userName)) {
      roomUsers[room].push(userName)
    }

    io.to(room).emit('room_users', roomUsers[room].length)
    socket.to(room).emit('user_joined', {
      message: `${userName} joined the room`,
    })
    console.log(` ${userName} joined room: ${room}`)
  })

  socket.on('send_message', async (data) => {
    try {
      await Message.create({
        room: data.room,
        content: data.content,
        sender: data.sender,
        senderId: data.senderId,
        role: data.role,
      })
    } catch (err) {
      console.error('Failed to save message:', err)
    }
    io.to(data.room).emit('receive_message', data)
  })

  socket.on('typing', ({ room, userName }) => {
    socket.to(room).emit('typing', { userName })
  })

  socket.on('stop_typing', ({ room, userName }) => {
    socket.to(room).emit('stop_typing', { userName })
  })

  socket.on('leave_room', ({ room, userName }) => {
    socket.leave(room)
    if (roomUsers[room]) {
      roomUsers[room] = roomUsers[room].filter((u) => u !== userName)
      io.to(room).emit('room_users', roomUsers[room].length)
    }
    socket.to(room).emit('user_left', {
      message: `${userName} left the room`,
    })
  })

  socket.on('disconnect', () => {
    const { userName, room } = socket.data
    if (room && userName && roomUsers[room]) {
      roomUsers[room] = roomUsers[room].filter((u) => u !== userName)
      io.to(room).emit('room_users', roomUsers[room].length)
    }
    console.log(' User disconnected:', socket.id)
  })
})

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB connected')
    httpServer.listen(process.env.PORT, () => {
      console.log(` Server running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.error(' MongoDB connection failed:', err.message)
  })