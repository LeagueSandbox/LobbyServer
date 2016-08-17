var child_process = require('child_process');
function LobbyFactory(){

  return {
    createLobby: createLobby
  };

  function createLobby(options){
    var lobby;

    lobby = {
      //Just for test we disable this
      //name: options.name || "",
      //hostSettings: options.hostSettings || [],
      //playerSettings: options.playerSettings || []
        name: "My Lobby",
        creator: "Me",
        playerLimit: 10,
        playerCount: 1,
        gameMode: "LeagueSandbox-Default",
        requirePassword: false,
        address: "http://localhost",
        port: 1234
    };

    //Here we execute lobby.js which will be the process
    //var lobby = require('../../lobby.js');
    var fork = require('child_process').fork;
    var child = fork('lobby');
    return lobby;
  }
}

module.exports = LobbyFactory();
