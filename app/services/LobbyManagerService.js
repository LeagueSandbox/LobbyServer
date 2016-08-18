var LobbyFactory = require('../factories/LobbyFactory');

function LobbyManagerService(){
  var lobbies = [];
  var lobbyCount = 1234;

  return {
    getLobbies: getLobbies,
    create: create,
    getLobbyId: lobbyCount
  };

  function create(options){
    var newLobbyId = lobbyCount;
    var newLobby = LobbyFactory.createLobby(options);
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
