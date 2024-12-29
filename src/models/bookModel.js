const mongoose = require('mongoose');
const { DB_COLLECTIONS } = require('../../utils/consts');

// Book schema definition
const bookSchema = new mongoose.Schema({
    childProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildProfile', required: true },
    title: { type: String, required: true },
    bookData: { 
        type: [
            {
                part_id: { type: Number, required: true },
                text: { type: String, required: true },
                image_url: { type: String }
            }
        ], 
        required: true 
    },
}, { timestamps: true });

module.exports = mongoose.model(DB_COLLECTIONS.BOOKS, bookSchema);
