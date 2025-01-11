const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Room = require('../models/Room');
const Message = require('../models/Message');

router.get('/rooms', auth, async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/rooms', auth, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/rooms/:roomId/messages', auth, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { roomId: req.params.roomId },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/rooms/:roomId/messages', auth, async (req, res) => {
  try {
    const message = await Message.create({
      content: req.body.content,
      userId: req.userId,
      roomId: req.params.roomId
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;