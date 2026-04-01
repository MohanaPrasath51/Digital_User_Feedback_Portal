const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const connectDB = require('./config/db');
const ensureAdminUser = require('./config/seedAdmin');
const cluster = require('cluster');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Multithreading Implementation Configuration
// Only use clustering in production or if explicitly enabled via USE_CLUSTER=true
const useCluster = process.env.NODE_ENV === 'production' || process.env.USE_CLUSTER === 'true';

if (useCluster && cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`[Master] Spawning ${numCPUs} threads for the Feedback Portal...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`[Master] Worker ${worker.process.pid} died. Respawning...`);
    cluster.fork();
  });
} else {
  // --- Start Workers or Single Process Logic ---

  // Define a cleaner prefix for logging (only if we're in a cluster worker)
  const logPrefix = cluster.isWorker ? `[Worker ${cluster.worker.id}] ` : '';

  const initializeApp = async () => {
    // 1. Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      console.log(`${logPrefix}Initializing Firebase Admin...`);
      
      let serviceAccount;
      const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

      if (fs.existsSync(serviceAccountPath)) {
        console.log(`${logPrefix}Loading Firebase from serviceAccountKey.json`);
        const rawJson = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        
        // Map snake_case (JSON file) to camelCase
        serviceAccount = {
          projectId: rawJson.project_id || rawJson.projectId,
          clientEmail: rawJson.client_email || rawJson.clientEmail,
          privateKey: rawJson.private_key || rawJson.privateKey
        };
      } else {
        console.log(`${logPrefix}Loading Firebase from Environment Variables`);
        serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY
        };
      }

      // Robust check for required fields
      if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        console.log(`${logPrefix}Diagnostic - ProjectId: ${!!serviceAccount.projectId}, Email: ${!!serviceAccount.clientEmail}, Key: ${!!serviceAccount.privateKey}`);
        throw new Error('Missing Firebase Admin credentials. Please check serviceAccountKey.json or Environment Variables.');
      }

      // --- Robust PEM Normalization ---
      let privateKey = serviceAccount.privateKey.trim();
      // Remove literal quotes
      if ((privateKey.startsWith('"') && privateKey.endsWith('"')) ||
          (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
        privateKey = privateKey.slice(1, -1);
      }
      // Replace literal \n and strip NULL bytes
      privateKey = privateKey.replace(/\\n/g, '\n').replace(/\0/g, '');
      
      if (!privateKey.includes('-----BEGIN')) {
        throw new Error("Private Key must contain PEM markers like -----BEGIN PRIVATE KEY-----");
      }

      serviceAccount.privateKey = privateKey;

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log(`${logPrefix}Firebase Admin initialized successfully.`);
    }

    // 3. Connect to Database (MongoDB)
    await connectDB();

    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [];

    const corsOptions = {
      origin: function (origin, callback) {

        // allow requests with no origin (like mobile apps / Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.log("Blocked by CORS:", origin);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true
    };

    // 4. Initialize Express App & Socket.io
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, { cors: corsOptions });

    app.set('io', io);

    io.on('connection', (socket) => {
      socket.on('join_feedback', (feedbackId) => socket.join(feedbackId));
      socket.on('leave_feedback', (feedbackId) => socket.leave(feedbackId));

      // Typing Indicators logic
      socket.on('typing', ({ feedbackId, userName, role }) => {
        socket.to(feedbackId).emit('user_typing', { userId: socket.id, userName, role });
      });

      socket.on('stop_typing', (feedbackId) => {
        socket.to(feedbackId).emit('user_stop_typing', { userId: socket.id });
      });
    });

    app.use(cors(corsOptions));
    app.use(express.json());

    // 5. Setup Routes
    app.use('/api/users', require('./routes/userRoutes'));
    app.use('/api/admin', require('./routes/adminRoutes'));
    app.use('/api/feedback', require('./routes/feedbackRoutes'));
    app.use('/api/notifications', require('./routes/notificationRoutes'));

    // 6. Health check & Error Handlers
    app.get('/', (req, res) => {
      res.json({ message: 'Feedback Portal API is running', worker: cluster.worker?.id });
    });

    app.use((req, res, next) => {
      res.status(404).json({ message: `Resource not found: ${req.originalUrl}` });
    });

    app.use((err, req, res, next) => {
      console.error(`${logPrefix}Error:`, err.stack);
      const status = err.status || 500;
      res.status(status).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
      });
    });

    // 7. Seed Data and Start Server
    try {
      await ensureAdminUser(admin);
      console.log(`${logPrefix}Admin & Department seeding completed`);
    } catch (error) {
      console.error(`${logPrefix}Admin seed warning: ${error.message}`);
    }

    server.listen(PORT, () => {
      console.log(`${logPrefix}Server running on port ${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`${logPrefix}Error: Port ${PORT} is already in use. Please kill the process running on this port or use a different port.`);
        process.exit(1);
      } else {
        console.error(`${logPrefix}Server error:`, err.message);
      }
    });
  };

  // Start initialization
  initializeApp().catch((error) => {
    console.error(`${logPrefix}Startup error:`, error.message);
    process.exit(1);
  });
}
