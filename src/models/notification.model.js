import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  similarQuery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Query',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }); 

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
