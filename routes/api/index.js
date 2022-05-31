const router = require('express').Router();

const userRoutes = require('./userRoutes');
router.use('/users', userRoutes);

const characterRoutes = require('./characterRoutes');
router.use('/characters', characterRoutes);

module.exports = router;