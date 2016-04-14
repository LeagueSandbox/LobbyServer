var LobbyFactory = require('../factories/LobbyFactory');

function LobbyManagerService(){
  var lobbies = [];
  var lobbyCount = 0;

  return {
    getLobbies: getLobbies,
    create: create,
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
    clients.push(lobby);
  }

  function removeLobbyFromList(lobby){
    clients.splice(clients.indexOf(lobby), 1);
  }
}

module.exports = LobbyManagerService();
