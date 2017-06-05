const LobbyFactory = require('../factories/LobbyFactory');
const lobbies = [];
let lobbyCount = 0;
let lobbyPort = 20000;
let gameServerPort = 13565;

function LobbyManagerService() {

    return { getLobbies, create, getLobbyById, removeLobbyFromList };

    function create(options, configPath) {
        const newLobbyId = lobbyCount;
        const newLobby = LobbyFactory.createLobby(newLobbyId, options, lobbyPort, configPath, gameServerPort);
        lobbyPort++;
        lobbyCount++;
        gameServerPort++;

        addLobbyToList(newLobby);

        return newLobby;
    }

    function getLobbies() {
        return lobbies;
    }

    function addLobbyToList(lobby) {
        lobbies.push(lobby);
    }

    function removeLobbyFromList(lobby) {
        lobbies.splice(lobbies.indexOf(lobby), 1);
    }

    function getLobbyById(lobbyId) {
        return lobbies.find(x => x.id === lobbyId);;
    }
}

module.exports = LobbyManagerService();
