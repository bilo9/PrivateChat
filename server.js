// Server-side (Node.js) code
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let count = 0;
const users = new Set();


  
io.on('connection', (socket) => {
  console.log('A user connected');
  count++;
  io.emit('online count', count);
  socket.on('join', (username) => {
    if (users.has(username)) {
      socket.emit('usernameTaken', 'Username is already taken. Please choose a different username.');
    } else {
      users.add(username);
      socket.username = username;
      socket.emit('joinSuccess', `Welcome to the chat, ${username}!`);
      io.emit('userJoined', `${username} has joined the chat.`);
    }
  });

  // Event when a client sends a message
  socket.on('message', (message) => {

    io.emit('message', `${socket.username}: ${message}`);
  });
    

  // Event when a client leaves the chat
  socket.on('disconnect', () => {
    if (socket.username) {
      console.log('A user disconnected');
      count--;
      io.emit('online count', count);
      users.delete(socket.username);
      io.emit('userLeft', `${socket.username} has left the chat.`);
    }
  });
});

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});




