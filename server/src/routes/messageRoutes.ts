const express = require('express');
const router = express.Router();
const { getMessages, getDirectMessages } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/direct/:userId', getDirectMessages);
router.get('/:channelId', getMessages);

module.exports = router;
