const express = require('express');

const app = express();
const http = require('http').Server(app);
const serverSocket = require('socket.io')(http);

const PORT = process.env.PORT || 8000;

app.use(express.static('public'));

const host = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : "http://localhost"

http.listen(PORT, () => {
  const portaStr = (PORT === 80) ? '' : `:${PORT}`
  
  if (process.env.HEROKU_APP_NAME)
    console.log(`Server running on ${host}`);
  else 
    console.log(`Server running on ${host+portaStr}`);
    
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

serverSocket.on('connection', (socket) => {
  
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
