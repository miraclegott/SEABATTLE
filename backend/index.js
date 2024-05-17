const session = require('express-session');
const express = require('express');

const PartyManager = require('./src/PartyManager');
const pm = new PartyManager();

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http);
const port = 3000;

app.set('trust proxy', 1) // trust first proxy

app.use( 
  session({
    secret : 's3Cur3',
    name : 'sessionId',
  })
);

app.use(express.static('./../frontend/'));

http.listen(port, () => {
  console.log(`port: ${port}`);
});

io.on('connection', (socket) => {
  pm.connection(socket);
  // pm.addPlayer(socket);

  io.emit("playerCount", io.engine.clientsCount);

	socket.on('disconnect', () => {
    pm.disconnect(socket);

		io.emit("playerCount", io.engine.clientsCount);
	});

  // socket.on('findRandomOpponent', () => {
  //   socket.emit('statusChange', 'randomOpponentFinding');

  //   pm.playRandom(socket);
  // })
});