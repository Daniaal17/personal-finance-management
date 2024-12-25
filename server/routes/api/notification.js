const { auth } = require("../../middlewares");
let Notification = require("../../models/Notification");
let router = require("express").Router();

// Middleware to fetch notification by ID
router.param("notificationId", async (req, res, next, _id) => {
  try {
    const notification = await Notification.findById(_id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    req.notification = notification;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Get all notifications for the user
router.get("/", auth.required, auth.user, async (req, res) => {
  try {
    const options = {
      page: +req.query.page || 1,
      limit: +req.query.limit || 50,
      sort: { createdAt: -1 },
    };

    const notifications = await Notification.paginate({ sentTo: req.user._id }, options);
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Mark all notifications as read
router.get("/mark-all", auth.required, auth.user, async (req, res) => {
  try {
    await Notification.updateMany(
      { sentTo: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Mark a specific notification as read
router.get("/mark-as-read/:notificationId", auth.required, auth.user, async (req, res) => {
  try {
    req.notification.isRead = true;
    await req.notification.save();
    return res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Delete a specific notification
router.delete("/delete/:notificationId", auth.required, auth.user, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.notificationId);
    return res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
