var LobbyFactory = require('../factories/LobbyFactory');
var lobbies = [];
var lobbyCount = 1234;
var gameServerPort = 13565;

function LobbyManagerService(){

  return {
    getLobbies: getLobbies,
    create: create
  };

  function create(options, configPath){
    var newLobbyId = lobbyCount;
    module.exports.lobbyCount = lobbyCount;
    var newLobby = LobbyFactory.createLobby(options, lobbyCount, configPath, gameServerPort);
    newLobby.id = newLobbyId;
    lobbyCount++;
    gameServerPort++;

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
