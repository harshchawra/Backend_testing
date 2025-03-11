import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['lost', 'found'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    phone: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['open', 'resolved'],
        default: 'open'
    }
}, { timestamps: true });

const Query = mongoose.model("Query", querySchema);

export default Query;
