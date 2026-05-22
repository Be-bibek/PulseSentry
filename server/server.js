import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import { startRulesEngine, ingestMetric } from './rulesEngine.js';

// Routes
import authRoutes from './routes/auth.js';
import hostRoutes from './routes/hosts.js';
import alertRoutes from './routes/alerts.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production this should be restricted
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hosts', hostRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/ai', aiRoutes);

// Socket.io Real-time Handlers
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Dashboard clients subscribe to their workspace room
  socket.on('join-workspace', (workspaceId) => {
    socket.join(workspaceId);
    console.log(`Socket ${socket.id} joined workspace ${workspaceId}`);
  });

  // Agents send metrics here
  socket.on('agent-metrics', (data) => {
    const { workspaceId, hostId, metrics } = data;
    
    // 1. Ingest for Alert Evaluation
    ingestMetric(workspaceId, hostId, metrics);
    
    // 2. Broadcast immediately to any connected dashboards in the workspace
    io.to(workspaceId).emit('host-metrics-update', { hostId, metrics });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Connect DB & Start Engine
connectDB().then(() => {
    startRulesEngine(io);
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`PulseSentry Backend running on port ${PORT}`));
});
