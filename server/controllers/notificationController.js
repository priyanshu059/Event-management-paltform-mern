// ============================================================
// controllers/notificationController.js - Notifications CRUD
// ============================================================
import Notification from '../models/Notification.js';

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createNotification = async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.status(201).json(notif);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: 'Notification not found' });

    // ✅ Fixed: only owner or admin can mark as read
    const isOwner = notif.user?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorised to update this notification' });
    }

    notif.isRead = true;
    await notif.save();
    res.json(notif);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
