// ============================================================
// server.js - Main Entry Point for EventOps Backend
// ============================================================
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { startReminderScheduler } from './services/reminderService.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables first
dotenv.config();

// --- Import all route files ---
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import speakerRoutes from './routes/speakerRoutes.js';
import sponsorshipRoutes from './routes/sponsorshipRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import intelligenceRoutes from './routes/intelligenceRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';

const app = express();

// ---- CORS ----
// ✅ Fixed: reads CLIENT_URL from .env so it works both locally and in production
// Set CLIENT_URL=https://yourdomain.com in your production .env
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// ---- Connect to MongoDB ----
connectDB();

// ---- Register API Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/reminders', reminderRoutes);   // ✅ New: reminder endpoints

// ---- Production: Serve built React client ----
// ✅ Fixed: in production the backend also serves the frontend static files
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientBuild = path.join(__dirname, '..', 'client', 'dist');

  app.use(express.static(clientBuild));

  // Any route not matched by the API falls through to React Router
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

// ---- Global Error Handler ----
app.use(errorHandler);

// ---- Start Reminder Scheduler ----
startReminderScheduler();

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ EventOps Server running on http://localhost:${PORT}`);
});
