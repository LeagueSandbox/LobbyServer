var fs = require('fs');
var path;
getGameServerPath();

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
        var newLobby = LobbyManagerService.create(options, path);
        //We send all the info to let clients add the new server to the list
        broadcast('lobbylist-add', newLobby);
        console.log("New lobby created with ID " + LobbyManagerService.lobbyCount);
    });

    client.on('disconnect', function(){
        console.log("Client disconnected");
        ClientManagerService.disconnected(client);
    });
});
function getGameServerPath(){
    if (fs.existsSync('./config/config.json')) {
        console.log("Checking your config file");   
        fs.readFile('./config/config.json', function read(err, data) {
            if (err) {
                throw err;
            }
            var config = data;
            var configData = JSON.parse(config);
            checkGameServer(configData.path);
        });
    } else {
        console.log("Couldn't find Config.json in config folder.");
        console.log("Please, download the file from the Github repository");
        process.exit();
    }
}
function checkGameServer(path2){
    if (fs.existsSync(path2)) {
        console.log("Detected GameServer!")
        path = path2;
    } else {
        console.log("---------------------------");
        console.log("Couldn't detect GameServer in: ");
        console.log(path2);
        console.log("Note that you should write the path for the exe of GameServer");
        console.log("---------------------------");
        process.exit();
    }
}
