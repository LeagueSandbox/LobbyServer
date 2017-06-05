const fs = require('fs');
let path;
getGameServerPath();

const port = 9090;
const portMaterLobbyServer = 9089;
const io = require('socket.io')(port);
const masterLobbyServer = require('socket.io')(9089);
const ClientManagerService = require('./app/services/ClientManagerService');
const LobbyManagerService = require('./app/services/LobbyManagerService');

console.log("---------------------------");
console.log("League Sandbox Lobby Server");
console.log("Listening on port " + port);
console.log("---------------------------");

/**
 * Lobby server
 * Server where user log in to see other people and lobbies
 */

const connections = {};
let playerId = 0;

function broadcast(name, data) {
    Object.keys(connections).map(x => connections[x]).forEach(conn => {
        conn.emit(name, data);
    });
}

io.on('connection', client => {
    console.log("Client connected");
    let id = playerId++;
    connections[id] = client;
    client.playerId = id;
    client.username = "Unknown";
    client.iconId = 0;
    ClientManagerService.connected(client);
    broadcast('users-add', ClientManagerService.create(client));

    client.on('lobby.list', () => {
        var lobbies = LobbyManagerService.getLobbies();
        client.emit('lobby.list', lobbies);
    });

    client.on('lobby.create', options => {
        options.owner = client.username;
        const newLobby = LobbyManagerService.create(options, path);
        //We send all the info to let clients add the new server to the list
        broadcast('lobbylist-add', newLobby);
        client.emit('lobby.create', newLobby);
    });

    client.on('user.list', () => {
        const clients = ClientManagerService.getClients();
        client.emit('user.list', clients);
    });

    client.on('user.userInfo', userInfo => {
        ClientManagerService.setUserProfile(client, userInfo);
        broadcast('users-update', ClientManagerService.create(client));
        client.emit('user.userInfo', ClientManagerService.create(client));
    });

    client.on('disconnect', function () {
        console.log("Client disconnected");
        broadcast('users-remove', ClientManagerService.create(client));
        ClientManagerService.disconnected(client);
    });
});

masterLobbyServer.on('connection', function (client) {

    client.on("heartbeat", data => {
        const lobby = LobbyManagerService.getLobbyById(data.id);
        Object.assign(lobby, data)
        broadcast('lobbylist-update', LobbyManagerService.getLobbyById(data.id));
    });

    client.on("close", data => {
        console.log("Close");
        LobbyManagerService.removeLobbyFromList(LobbyManagerService.getLobbyById(data.id));
        broadcast('lobbylist-remove', {
            id: data.id
        });
    });
});

function getGameServerPath() {
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
function checkGameServer(gameServerPath) {
    if (fs.existsSync(gameServerPath)) {
        console.log("Detected GameServer!")
        path = gameServerPath;
    } else {
        console.log("---------------------------");
        console.log("Couldn't detect GameServer in: ");
        console.log(gameServerPath);
        console.log("Note that you should write the path for the exe of GameServer");
        console.log("---------------------------");
        process.exit();
    }
}

/**
 * Lobbies central server
 */
