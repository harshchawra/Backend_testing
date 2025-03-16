import mongoose from 'mongoose';

const querySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    status: {
      type: String,
      enum: ['lost', 'found'],
      required: true,
      index: true, // 🔥 Indexed for fast filtering
    },
    category: {
      type: String,
      required: true,
      index: true, // 🔥 Indexed to optimize category-based searches
    },
    brandName: {
      type: String,
    },
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    primaryColor: {
      type: String, // 🔵 Helps in identification (Red, Black, etc.)
    },
    uniqueIdentifier: {
      type: String, // 🔍 IMEI, Serial Number, etc.
    },
    date: {
      type: Date,
      required: true,
      index: true, // 🔥 Indexed for sorting recent lost/found items
      get: (v) => (v ? v.toISOString().split('T')[0].split('-').reverse().join('-') : null),
      set: (v) => {
        const [day, month, year] = v.split('-');
        return new Date(`${year}-${month}-${day}`);
      },
    },
    time: {
      type: String, // 🕒 If needed for better tracking
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // HH:mm format (24-hour)
        },
        message: (props) => `${props.value} is not a valid time format! Use HH:mm (24-hour).`,
      },
    },
    location: {
      type: String,
      required: true,
      index: true, // 🔥 Location-based searches optimized
    },
    imageUrl: {
      type: String, // 📷 Image of lost/found item
    },
    type: {
      type: String,
      enum: ['open', 'resolved'],
      default: 'open',
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

// Ensure compound indexes are created
querySchema.index({ status: 1, category: 1 });
querySchema.index({ location: 1, date: -1 }); // Sort by most recent
querySchema.index({ brandName: 1 });

const Query = mongoose.model('Query', querySchema);
export default Query;
