var port = 9090;
var io = require('socket.io')(port);
var ClientManagerService = require('./app/services/ClientManagerService');

console.log("League Sandbox Lobby Server");
console.log("---------------------------");
console.log("Listening on port " + port);


io.on('connection', function(client){
  console.log("Client connected");
  ClientManagerService.connected(client);

  client.on('disconnect', function(){
    console.log("Client disconnected");
    ClientManagerService.disconnected(client);
  });
});
