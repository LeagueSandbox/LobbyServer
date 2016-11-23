var port = 9090;
var io = require('socket.io')(port);
var ClientManagerService = require('./app/services/ClientManagerService');
var LobbyManagerService = require('./app/services/LobbyManagerService');

console.log("---------------------------");
console.log("League Sandbox Lobby Server");
console.log("Listening on port " + port);
console.log("---------------------------");

const connections = {};
let playerId = 0;

function broadcast(name, data) {
    Object.keys(connections).map(x => connections[x]).forEach(conn => {
       conn.emit(name, data); 
    });
}

io.on('connection', function(client){
  console.log("Client connected");
  ClientManagerService.connected(client);
  let id = playerId++;
  connections[id] = client;

  client.on('lobby.list', function(){
    var lobbies = LobbyManagerService.getLobbies();
    //Send all the lobbies (list)
    client.emit('lobby.list', lobbies);
  });

  client.on('lobby.create', function(options){
    var newLobby = LobbyManagerService.create(options);
    //We send all the info to let clients add the new server to the list
    broadcast('lobbylist-add', newLobby);
    console.log("New lobby created with ID " + LobbyManagerService.lobbyCount);
  });

  client.on('disconnect', function(){
    console.log("Client disconnected");
    ClientManagerService.disconnected(client);
  });
});
