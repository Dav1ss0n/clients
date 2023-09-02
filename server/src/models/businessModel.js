const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: [String],
        ref: 'Category'
    },
    location: {
        address: {
            type: String,
            required: true
        },
        coordinates: {
            type: String,
            required: true
        }
    },
    logo: {
        type: String,
        default: null
    },
    color: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Business', businessSchema);