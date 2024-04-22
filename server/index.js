const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

let users = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    // Add user to the list
    users.push(socket);

    // Match users and start chat
    if (users.length >= 2) {
        const user1 = users.shift();
        const user2 = users.shift();
        startChat(user1, user2);
    }

    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Remove user from the list
        users = users.filter(user => user !== socket);
    });

    socket.on('chat message', (msg) => {
        // Broadcast message to the other user
        socket.broadcast.emit('chat message', {
          sender: socket.id, // Sender's ID
          message: msg
        });
    });
});

function startChat(user1, user2) {
    user1.on('chat message', (msg) => {
        user2.emit('chat message', {
          sender: user1.id,
          message: msg
        });
    });

    user2.on('chat message', (msg) => {
        user1.emit('chat message', {
          sender: user2.id,
          message: msg
        });
    });
}

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
