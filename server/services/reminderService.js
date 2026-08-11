// ============================================================
// server/services/reminderService.js - Automated Reminder Scheduler
// Replaces Flask APScheduler — runs every minute like the original
// ============================================================
import schedule from 'node-schedule';
import Reminder from '../models/Reminder.js';
import Notification from '../models/Notification.js';

let isRunning = false;

export const startReminderScheduler = () => {
  console.log('⏰ Reminder service started — checking every minute');

  // Run every minute (matches Flask APScheduler 60s interval)
  schedule.scheduleJob('* * * * *', async () => {
    if (isRunning) return; // Prevent overlap
    isRunning = true;

    try {
      const now = new Date();
      const dueReminders = await Reminder.find({
        reminderTime: { $lte: now },
        sent: false,
      }).populate('user', 'name email').populate('event', 'title date');

      if (dueReminders.length > 0) {
        console.log(`⏰ Processing ${dueReminders.length} due reminder(s)…`);
      }

      for (const reminder of dueReminders) {
        try {
          // Create in-app notification
          await Notification.create({
            user: reminder.user._id,
            title: '⏰ Event Reminder',
            message: reminder.message || `Reminder: ${reminder.event?.title || 'Your event'} is coming up!`,
            channel: 'in-app',
            isRead: false,
          });

          // Mark reminder as sent
          reminder.sent = true;
          await reminder.save();

          console.log(`✅ Reminder sent to user ${reminder.user?.name || reminder.user}`);
        } catch (innerError) {
          console.error(`❌ Failed to process reminder ${reminder._id}:`, innerError.message);
        }
      }
    } catch (error) {
      console.error('❌ Reminder service error:', error.message);
    } finally {
      isRunning = false;
    }
  });
};
