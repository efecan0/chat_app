const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server =http.createServer(app);
const io = socketio(server);

const port = process.env.port || 3000;

const publicPathUrl = path.join(__dirname, '../public');

app.use(express.static(publicPathUrl));


io.on('connection', (socket)=>{

socket.broadcast.emit('receivedMessage','Yeni kullanıcı katıldı');

socket.on('disconnect',()=>{
  socket.broadcast.emit('receivedMessage','Kullanıcı çıktı')
});

socket.on('sendMessage',(messageText,callback)=>{
  io.emit('receivedMessage',messageText);
  callback(true)
});

socket.on('sendLocation',coords=>{
socket.broadcast.emit('receivedMessage',`Koordinatlar geldi enlem: ${coords.latitude}, boylam : ${coords.longitude}`)
})





});

server.listen(port,()=>{
  console.log(`Server ayakta port: ${port}`);
});
