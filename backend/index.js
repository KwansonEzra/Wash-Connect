import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

import userRoutes from './routes/userRoutes.js';
import lspRoutes from './routes/lspRoutes.js';
import serviceCatalogRoutes from './routes/serviceCatalogRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

connectDB();

const app = express();

// Allow the frontend origin to send credentials (the JWT cookie) in dev,
// where the frontend and backend run on different ports.
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static uploads folder
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/lsps', lspRoutes);
app.use('/api/service-catalog', serviceCatalogRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});