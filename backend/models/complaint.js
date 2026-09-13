const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    // Humne enum add kar diya hai taaki galat category save na ho
    category: { 
        type: String, 
        required: true,
        enum: [
            'Water Supply', 
            'Electricity', 
            'Waste Management', 
            'Drainage/Sewage', 
            'Road/Potholes', 
            'Street Lights', 
            'Other'
        ]
    }, 
    status: { 
        type: String, 
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], 
        default: 'Pending' 
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedDept: { type: String, default: 'General' },
    response: { type: String, default: '' },
    feedback: { type: String, default: '' },
    image: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);