const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

let toDos = [];

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000);
const io = socket(server);

io.on('connection', (socket) => {
  socket.on('login', ({ user }) => {
    io.to(socket.id).emit('updateList', toDos);
  });
  socket.on('addTask', (task) => {
    toDos.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeItem', (id) => {
    toDos = toDos.filter((item) => item.id !== id);
    socket.broadcast.emit('updateList', toDos);
  });
});
