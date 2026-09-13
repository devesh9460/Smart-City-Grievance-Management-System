const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'department'], default: 'user' },
    deptName: { type: String, default: null } // Sirf department employees ke liye
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);