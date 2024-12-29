const mongoose = require('mongoose');
const { DB_COLLECTIONS } = require('../../utils/consts');

const childProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String },
    appearance: { type: String },
    hobbies: [String],
    location: { type: String },
    outfit: { type: String },
    favoriteFood: { type: String },
    favoriteColor: { type: String },
    favoriteThingToDo: { type: String },
    mostLovedCharacter: { type: String },
    additionalInfo: { type: String },
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields

module.exports = mongoose.model(DB_COLLECTIONS.CHILD_PROFILES, childProfileSchema);
