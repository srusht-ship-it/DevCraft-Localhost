const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
  getHotspots,
  getDashboardStats
} = require('../controllers/complaintController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), createComplaint);
router.get('/', getAllComplaints);
router.patch('/:id/status', updateComplaintStatus);
router.get('/hotspots', getHotspots);
router.get('/stats', getDashboardStats);

module.exports = router;
