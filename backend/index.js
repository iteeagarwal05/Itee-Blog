import express from 'express';
import { requestLogger } from './middlewares/requestLogger.js';
import { logger } from './config/logger.js';
import { configDotenv } from 'dotenv';
import connectDB from './config/db.js';
import blogRoutes from './routes/blogRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import cors from 'cors';
import "./utils/cronJobs/deleteExpiredBlogs.js";
import helmet from 'helmet'

configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet())
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware before routes
app.use(requestLogger);

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled Error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(500).json({
    message: 'Internal Server Error'
  });
});

app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/comments', commentRoutes)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error(`Error connecting to the database: ${error.message}`);
});