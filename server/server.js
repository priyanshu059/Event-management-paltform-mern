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
import contactRoutes from './routes/contactRoutes.js';   // ✅ Fix 15

const app = express();

// ---- CORS ----
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));

// Parse incoming JSON request bodies
app.use(express.json());

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
app.use('/api/reminders', reminderRoutes);
app.use('/api/contact', contactRoutes);   // ✅ Fix 15: real contact form endpoint

// ✅ Fix 12: Any unmatched /api/... route returns a JSON 404 instead of falling through to React HTML.
// This MUST be placed AFTER all route registrations and BEFORE the React catch-all.
app.all('/api/*', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// ---- Production: Serve built React client ----
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientBuild = path.join(__dirname, '..', 'client', 'dist');

  app.use(express.static(clientBuild));

  // React Router catch-all (comes AFTER the /api/* 404 handler)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

// ---- Global Error Handler ----
app.use(errorHandler);

// ✅ Fix 11: Await DB connection BEFORE starting server and scheduler.
// Previously connectDB() was called without await, so the server could accept
// requests before MongoDB was ready and the scheduler could fire before models were registered.
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();   // Wait for MongoDB to be fully connected

    // Start reminder scheduler only after DB is ready
    startReminderScheduler();

    app.listen(PORT, () => {
      console.log(`✅ EventOps Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
