const express = require('express');

const app = express();
const http = require('http').Server(app);
const serverSocket = require('socket.io')(http);

const PORT = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

serverSocket.on('connection', (socket) => {
  // console.log('Socket Handshake: ', socket.handshake);
  
  socket.on('login', (nickname) => {
    console.log('Client is connected: ', nickname);
    serverSocket.emit('chat msg', `User ${nickname} has joined the room`);
    socket.nickname = nickname;
  });

  socket.on('chat msg', (msg) => {
    console.log(`Message received from client -> ${socket.nickname}: ${msg}`);

    // Encaminhas mensagem aos usuários conectados
    serverSocket.emit('chat msg', `${socket.nickname}: ${msg}`);
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
})