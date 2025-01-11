
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: process.env.CORS_ORIGIN } });
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.get('/', (req, res) => res.json({ message: 'API Running' }));
server.listen(process.env.PORT || 3000, () => console.log('Server started'));
