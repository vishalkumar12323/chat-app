const express = require('express');
const router = express.Router();
const { createChannel, getChannels, joinChannel, getMyChannels } = require('../controllers/channelController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protect all channel routes

router.post('/', createChannel);
router.get('/', getChannels);
router.post('/:id/join', joinChannel);
router.get('/me', getMyChannels);

module.exports = router;
