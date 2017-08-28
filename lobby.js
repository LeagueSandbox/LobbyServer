const GameFactory = require('./app/factories/GameFactory.js');
"use strict";

let lobbyConf = JSON.parse(process.argv[2]);
const lobbyPort = process.argv[3]; //It is argv[2] because elements 0 and 1 are already populated with env info
const path = process.argv[4];
const gameServerPort = process.argv[5];


//TODO: conf file
const lobbyServer = require('socket.io')(lobbyPort);
const io = require('socket.io-client');
const repl = require('repl');

let map = 1;
let player_id = 0;

const adminSettings = [{
    binding: "available-champions",
    name: "Availble Champions",
    help: "Champions available",
    field: "championSelectMulti"
}, {
    binding: "available-spells",
    name: "Available Spells",
    help: "Spells available",
    field: "summonerSpellSelectMulti"
}, {
    binding: "map",
    name: "Map",
    help: "Foo",
    field: "mapSelect",
    default: 11,
    options: "*"
}];

const teams = [{
    id: 0,
    name: "Order",
    color: "black",
    playerLimit: 5
}, {
    id: 1,
    name: "Chaos",
    color: "black",
    playerLimit: 5
}];

const players = [];
let playerId = 0;

function sendInitialData(conn) {
    teams.forEach(t => {
        conn.emit("teamlist-add", t);
    });

    players.forEach(p => {
        conn.emit("playerlist-add", p);
    });

    adminSettings.forEach(p => {
        conn.emit("settinglist-add", Object.assign({}, p, { host: true }));
    });
}

const connections = {};

function broadcast(name, data) {
    Object.keys(connections).map(x => connections[x]).forEach(conn => {
        conn.emit(name, data);
    });
}

function sendHeartbeat() {
    connectionLobbyServer.emit('heartbeat', {
        id: lobbyConf.id,
        name: lobbyConf.name,
        owner: lobbyConf.owner,
        gamemodeName: lobbyConf.gamemodeName,
        playerLimit: lobbyConf.playerLimit,
        playerCount: Object.keys(connections).length,
        requirePassword: false
    });
}

const connectionLobbyServer = io.connect("http://127.0.0.1:9089", { reconnection: true, forceNew: true });
connectionLobbyServer.on("connect", () => {
    sendHeartbeat();
});

lobbyServer.on("connection", conn => {
    let id = playerId++;
    let player;
    connections[id] = conn;
    player_id++;

    conn.on("lobby-connect", data => {
        const firstFree = teams.filter(t => t.playerLimit - players.filter(p => p.teamId === t.id).length > 0)[0];
        player = {
            id: id,
            idServer: data.idServer,
            username: data.username,
            teamId: firstFree.id,
            isHost: Object.keys(connections).length == 1 ? true : false,
        };
        conn.emit("playerID", player.id);
        players.push(player);
        broadcast("playerlist-add", player);
        conn.emit("lobby-connect", {
            ok: true,
            name: lobbyConf.name,
            owner: lobbyConf.owner,
            gamemodeName: lobbyConf.gamemodeName,
            playerId: player_id
        });
        sendInitialData(conn);
        sendHeartbeat();
    });

    conn.on("host", () => {
        conn.emit("host", {
            isHost: player.isHost
        });
    });

    conn.on("lobby-setting", data => {
        setting = adminSettings.filter(x => x.binding === data["setting-binding"])[0];
        setting.host = true;

        console.log(setting.binding + " set to " + data.value);
        if (setting.binding == "map") {
            map = data.value;
        }

        if (setting.binding === "champion") {
            player.championId = data.value;
            broadcast("playerlist-update", { id: id, championId: data.value });
            conn.emit("settinglist-update", {
                binding: "skin"
            });
        }

        if (setting.binding === "skin") {
            player.skinIndex = data.value;
            broadcast("playerlist-update", {
                id,
                skinIndex: data.value
            });
        }

        if (setting.binding === "summonerSpells") {
            player.spell1id = data.value[0];
            player.spell1id = data.value[1];
            broadcast("playerlist-update", {
                id,
                spell1id: data.value[0],
                spell2id: data.value[1]
            });
        }

        Object.keys(connections).forEach(k => {
            if (connections[k] !== conn) {
                connections[k].emit("settinglist-update", {
                    binding: setting.binding,
                    value: data.value
                });
            }
        });
    });

    conn.on("chat-message", data => {
        broadcast("chat-message", {
            timestamp: new Date().getTime(),
            sender: player.username,
            message: data.message
        });
    });

    conn.on("join-team", data => {
        player.teamId = data.team;
        broadcast("playerlist-update", {
            id,
            teamId: data.team
        });
    });

    conn.on("disconnect", () => {
        delete connections[id];
        players.splice(players.indexOf(player), 1);
        broadcast("playerlist-remove", {
            id
        });
        if (Object.keys(connections).length === 0) {
            connectionLobbyServer.emit("close", {
                id: lobbyConf.id
            });
            process.exit();
        } else {
            if (player.isHost) {
                const firstPlayer = Object.keys(players)[0];
                players[firstPlayer].isHost = true;
                lobbyConf.owner = players[firstPlayer].username;
                connections[players[firstPlayer].id].emit("host", {
                    isHost: true
                });
                broadcast("playerlist-update", players[firstPlayer]);
            }
            sendHeartbeat();
        }
    });
    conn.on("start-game", () => {
        startGame();
    })
    conn.on("myID", () => {
        conn.emit("myID", player.id);
    })
});

function startGame() {
    GameFactory.startGameServer(players, gameServerPort, path, map, __dirname);
    broadcast("start-game", {
        gameServerPort
    });
}