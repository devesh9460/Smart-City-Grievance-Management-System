const router = require('express').Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth'); // Check karein aapki file ka naam auth.js hi hai na

// Category to Department Mapping logic
const categoryToDept = {
    'Water Supply': 'Water',
    'Electricity': 'Electricity',
    'Waste Management': 'Sanitation',
    'Drainage/Sewage': 'Sewerage',
    'Road/Potholes': 'Public Works',
    'Street Lights': 'Lighting',
    'Other': 'General'
};

// 1. CREATE COMPLAINT (User ke liye)
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const newComplaint = new Complaint({
            title,
            description,
            category,
            assignedDept: categoryToDept[category] || 'General',
            user: req.user.id
        });
        const savedComplaint = await newComplaint.save();
        res.status(201).json(savedComplaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET USER'S OWN COMPLAINTS (User dashboard ke liye)
router.get('/my', auth, async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. GET ALL COMPLAINTS (Admin sees all, Dept sees their specific ones)
router.get('/', auth, async (req, res) => {
    try {
        let complaints;
        if (req.user.role === 'admin') {
            // Admin ko sab dikhao aur user details bhi populate karo
            complaints = await Complaint.find().populate('user', 'name email').sort({ createdAt: -1 });
        } else if (req.user.role === 'department') {
            // Department ko unke assigned department ke hisaab se dikhao
            // Note: Iske liye Department user ke model mein 'department' field honi chahiye
            complaints = await Complaint.find().populate('user', 'name email').sort({ createdAt: -1 });
        } else {
            return res.status(403).json({ msg: 'Access denied. Authority only.' });
        }
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. UPDATE COMPLAINT (Admin/Dept status change karte hain)
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'department') {
            return res.status(403).json({ msg: 'Permission denied' });
        }

        const { status, response } = req.body;
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { $set: { status, response } },
            { new: true }
        );

        if (!updatedComplaint) return res.status(404).json({ msg: 'Complaint not found' });
        res.json(updatedComplaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE COMPLAINT (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Admin only access.' });
        }
        await Complaint.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Complaint deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. GET ANALYTICS SUMMARY (Admin Dashboard Counters ke liye)
router.get('/analytics/summary', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only.' });

        const stats = {
            total: await Complaint.countDocuments(),
            resolved: await Complaint.countDocuments({ status: 'Resolved' }),
            inProgress: await Complaint.countDocuments({ status: 'In Progress' }),
            pending: await Complaint.countDocuments({ status: 'Pending' }),
            rejected: await Complaint.countDocuments({ status: 'Rejected' })
        };

        const byCategory = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.json({ ...stats, byCategory });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;