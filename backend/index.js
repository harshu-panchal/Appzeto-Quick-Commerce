import express from "express"
import dotenv from "dotenv"
import connectDB from "./app/dbConfig/dbConfig.js"
import setupRoutes from "./app/routes/index.js";
import cors from "cors"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
const NODE_ENV = process.env.NODE_ENV || "development";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// CORS Configuration
const corsOptions = {
  origin: NODE_ENV === "production" 
    ? FRONTEND_URL.split(',').map(url => url.trim())
    : "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV 
  });
});

// Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Quick Commerce API',
    version: '1.0.0',
    status: 'running'
  });
});

// Connect to Database
connectDB();

// Setup Routes
setupRoutes(app);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: true,
    message: 'Route not found' 
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    success: false, 
    error: true,
    message: NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`
╔════════════════════════════════════════╗
║   Quick Commerce API Server Started    ║
╠════════════════════════════════════════╣
║ Environment: ${NODE_ENV.padEnd(28)} ║
║ Port: ${PORT.toString().padEnd(33)} ║
║ CORS Origin: ${FRONTEND_URL.substring(0, 25).padEnd(28)} ║
╚════════════════════════════════════════╝
  `);
});
