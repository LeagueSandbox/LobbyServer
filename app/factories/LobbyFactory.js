const child_process = require('child_process');
const LobbyManagerService = require('../services/LobbyManagerService.js');

function LobbyFactory() {

    return {
        createLobby: createLobby
    };
    function createLobby(id, options, port, configPath, gameServerPort) {
        const lobby = {
            id: id,
            name: options.name,
            owner: options.owner,
            playerLimit: options.playerLimit,
            playerCount: 0,
            gamemodeName: options.gamemodeName,
            requirePassword: false,
            address: "http://localhost",
            port: port
        };
        //We start a Lobby process and we send the port
        const child = child_process.fork('lobby', [JSON.stringify(lobby), port, configPath, gameServerPort]);
        return lobby;
    }
}
module.exports = LobbyFactory();