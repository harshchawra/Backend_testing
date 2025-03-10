const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['lost', 'found'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
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

module.exports = Query;
