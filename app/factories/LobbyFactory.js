var child_process = require('child_process');
var LobbyManagerService = require('../services/LobbyManagerService.js');

var lobbyCount = 1234;
exports.lobbyCount = 1234;

function LobbyFactory(){
  lobbyCount = 1234;
  return {
    createLobby: createLobby
  };
  function createLobby(options){
    var lobby;
    exports.lobbyCount = lobbyCount;
    
    lobby = {
        name: "My Lobby",
        creator: "Me",
        playerLimit: 10,
        playerCount: 1,
        gameMode: "LeagueSandbox-Default",
        requirePassword: false,
        address: "http://localhost",
        port: lobbyCount
    };

    var fork = require('child_process').fork;
    var child = fork('lobby');
    lobbyCount++;
    return lobby;
  }
}
module.exports = LobbyFactory();
