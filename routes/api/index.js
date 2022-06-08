const router = require('express').Router();

const userRoutes = require('./userRoutes');
router.use('/users', userRoutes);

const characterRoutes = require('./characterRoutes');
router.use('/characters', characterRoutes);

const groupRoutes = require('./groupRoutes');
router.use('/groups', groupRoutes);

const groupmemberRoutes = require('./groupmemberRoutes');
router.use('/groupmembers', groupmemberRoutes);

const notificationRoutes = require('./notificationRoutes');
router.use('/notifications', notificationRoutes);

module.exports = router;