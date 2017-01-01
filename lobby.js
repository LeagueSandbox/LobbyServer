var child_process = require('child_process');
var fs = require('fs');
var LobbyFactory = require('./app/factories/LobbyFactory.js');
var LobbyManagerService = require('./app/services/LobbyManagerService.js');
"use strict";

var lobbyPort = process.argv[2]; //It is argv[2] because elements 0 and 1 are already populated with env info
var path = process.argv[3];
var gameServerPort = process.argv[4];
const io = require('socket.io')(lobbyPort);
const repl = require('repl');

const name = LobbyFactory.name;
const creator = LobbyFactory.creator;
const gamemode = LobbyFactory.gameMode;
var map = 1;
var player_id = 0;

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

const playerSettings = [{
    binding: "champion",
    name: "Champion",
    help: "The champion you want to play",
    field: "championSelect",
    options: "available-champions"
}, {
    binding: "skin",
    name: "Skin",
    help: "Skinz",
    field: "skinSelect",
    options: "champion"
}, {
    binding: "summonerSpells",
    name: "Summoner Spells",
    help: "The summoner spells you want to use",
    field: "summonerSpellSelect",
    default: [7, 4],
    options: "available-spells"
}, {
    binding: "text",
    name: "Text",
    help: "Foo",
    field: "text",
    default: "Text here..."
}, {
    binding: "check",
    name: "Checkbox",
    help: "Foo",
    field: "checkbox",
    default: true
}, {
    binding: "select",
    name: "Select",
    help: "Foo",
    field: "select",
    default: "a",
    options: [{ value: "a", content: "A" }, { value: "b", content: "B" }]
}];

const teams = [{
    id: 0,
    name: "Order",
    color: "black",
    playerLimit: 1
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
    
    playerSettings.forEach(p => {
       conn.emit("settinglist-add", Object.assign({}, p, { host: false })); 
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

io.on("connection", (conn) => {
    let id = playerId++;
    let player;
    connections[id] = conn;
    player_id++;
    
    conn.on("lobby-connect", data => {
        conn.emit("lobby-connect", {
            ok: true,
            name: name,
            creator: creator,
            gamemode: gamemode,
            playerId: player_id
        });
        const firstFree = teams.filter(t => t.playerLimit - players.filter(p => p.teamId === t.id).length > 0)[0];
        sendInitialData(conn);

        player = {
            id: id,
            name: data.name,
            teamId: firstFree.id,
            championId: 0,
            skinIndex: 0,
            spell1id: 7,
            spell2id: 4
        };
        
        players.push(player);        
        broadcast("playerlist-add", player);
    }); 
    
    conn.on("lobby-setting", data => {
        let setting = playerSettings.filter(x => x.binding === data["setting-binding"])[0];      
        if (!setting) {
            setting = adminSettings.filter(x => x.binding === data["setting-binding"])[0];
            setting.host = true;
        }  
        
        console.log(setting.binding + " set to " + data.value);
        if (setting.binding == "map"){
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
            
        if (setting.host) {  
            Object.keys(connections).forEach(k => {
                if (connections[k] !== conn) {
                    connections[k].emit("settinglist-update", { 
                        binding: setting.binding, 
                        value: data.value 
                    });
                }
            });
        }
    });
    
    conn.on("chat-message", data => {
        broadcast("chat-message", { 
            timestamp: new Date().getTime(), 
            sender: player.name, 
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
    });
    conn.on("start-game", () => {
        var GameFactory = require('./GameFactory.js');
        GameFactory.startGameServer(players, gameServerPort, path, map);
        broadcast("start-game", { 
            gameServerPort
        });
    });
});

repl.start('> ').context.broadcast = broadcast;
