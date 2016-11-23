var LobbyFactory = require('../factories/LobbyFactory');
var lobbies = [];
var lobbyCount = 1234;

function LobbyManagerService(){

  return {
    getLobbies: getLobbies,
    create: create
  };

  function create(options){
    var newLobbyId = lobbyCount;
    module.exports.lobbyCount = lobbyCount;
    var newLobby = LobbyFactory.createLobby(options, lobbyCount);
    newLobby.id = newLobbyId;
    lobbyCount++;

    addLobbyToList(newLobby);

    return newLobby;
  }

  function getLobbies(){
    return lobbies;
  }

  function addLobbyToList(lobby){
    lobbies.push(lobby);
  }

  function removeLobbyFromList(lobby){
    lobbies.splice(lobbies.indexOf(lobby), 1);
  }
}

module.exports = LobbyManagerService();
