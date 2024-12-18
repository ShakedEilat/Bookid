const mongoose = require('mongoose');
const { DB_COLLECTIONS } = require('../../utils/consts');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });
module.exports = mongoose.model(DB_COLLECTIONS.USERS, userSchema);