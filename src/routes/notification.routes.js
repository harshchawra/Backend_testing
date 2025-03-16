import express from 'express';
import { getNotifications, markNotificationAsRead } from "../controllers/notification.controller.js";
import authenticateUser from '../middleware/auth.middleware.js'; 

const router = express.Router();

router.get("/notifications", authenticateUser, getNotifications);
// router.get("/notifications",  getNotifications);
router.patch("/notifications/:notificationId/read", authenticateUser, markNotificationAsRead);
// router.patch("/notifications/:notificationId/read",  markNotificationAsRead);

export default router;
