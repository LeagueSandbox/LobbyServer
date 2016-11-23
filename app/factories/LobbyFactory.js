var child_process = require('child_process');
var LobbyManagerService = require('../services/LobbyManagerService.js');

function LobbyFactory(){

  return {
    createLobby: createLobby
  };
  function createLobby(options, port){
    var lobby;

    lobby = {
        name: options.name,
        creator: options.creator,
        playerLimit: options.playerLimit,
        playerCount: 0,
        gameMode: options.gamemodeName,
        requirePassword: false,
        address: "http://localhost",
        port: port
    };
    module.exports = {
        name: options.name,
        creator: options.creator,
        playerLimit: options.playerLimit,
        playerCount: 0,
        gameMode: options.gamemodeName,
        requirePassword: false,
        address: "http://localhost",
        port: port
    };
    var fork = require('child_process').fork;
    //We start a Lobby process and we send the port
    var child = fork('lobby', [port]);
    return lobby;
  }
}
module.exports = LobbyFactory();
