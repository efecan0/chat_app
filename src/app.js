const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const { getMessage } = require('./utils/message');
const { addUser, getUser, removeUser, getUserListInChannel } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.port || 3000;

const publicPathDirectory = path.join(__dirname, '../public');

app.use(express.static(publicPathDirectory));

io.on('connection', (socket) => {

  socket.on('join', ({ username, channel }, callback) => {
    const { user, error } = addUser(socket.id, username, channel);

    socket.join(channel);

    io.to(channel).emit('sidebarInfo', {
      channel,
      users: getUserListInChannel(channel)
    });

    socket.emit('receivedMessage', getMessage('Admin', 'Hosgeldiniz.'));
    socket.broadcast.to(channel)
        .emit('receivedMessage', getMessage('Admin', `${username} kullanicisi baglandi.`));

  });

  socket.on('sendMessage', (messageText, callback) => {
    const user = getUser(socket.id);


    io.to(user.channel).emit('receivedMessage', getMessage(user.username, messageText));
    callback(true);
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      const { username, channel } = user;

      io.to(channel).emit('sidebarInfo', {
        channel,
        users: getUserListInChannel(channel)
      });
      io.to(channel).emit('receivedMessage',
            getMessage('Admin', `${username} kullanicisi gitti.`))
    }
  });

  socket.on('sendLocation', ({ latitude, longitude }) => {
      const { username, channel } = getUser(socket.id);
    const url = `http://maps.google.com?q=${latitude},${longitude}`;
    io.to(channel).emit('receivedMessage',
          getMessage(username, undefined, url));
  })
});

server.listen(port, () => {
  console.log(`Serverimizi ${port} portunda hazir...`)
})
