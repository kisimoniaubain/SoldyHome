const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers, toggleUserStatus, setUserRole } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.put('/users/:id/role', setUserRole);

module.exports = router;
