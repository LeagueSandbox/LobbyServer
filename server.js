var port = 9090;
var io = require('socket.io')(port);
var ClientManagerService = require('./app/services/ClientManagerService');
var LobbyManagerService = require('./app/services/LobbyManagerService');

console.log("League Sandbox Lobby Server");
console.log("---------------------------");
console.log("Listening on port " + port);


io.on('connection', function(client){
  console.log("Client connected");
  ClientManagerService.connected(client);

  client.on('lobby.list', function(){
    var lobbies = LobbyManagerService.getLobbies();
    client.emit('lobby.list', lobbies);
  });

  client.on('lobby.create', function(options){
    var newLobby = LobbyManagerService.create(options);
    client.emit('lobby.create', newLobby);
  });

  client.on('disconnect', function(){
    console.log("Client disconnected");
    ClientManagerService.disconnected(client);
  });
});
