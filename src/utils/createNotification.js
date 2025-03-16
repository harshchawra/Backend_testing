import Notification from '../models/notification.model.js';

export async function createNotification(userId, queryId) {
    try {
        
        const existingNotification = await Notification.findOne({
            user: userId,
            similarQuery: queryId
        });

        
        if (!existingNotification) {
            await Notification.create({
                user: userId,
                similarQuery: queryId,
                isRead: false
            });
        }
    } catch (error) {
        console.error("Error creating notification:", error);
    }
}
