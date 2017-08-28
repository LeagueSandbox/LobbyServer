const ClientFactory = require('../factories/ClientFactory');

function ClientManagerService() {
    const clients = [];

    return { connected, disconnected, setUserProfile, create, getClients };

    function connected(client) {
        clients.push(client);
    }

    function setUserProfile(client, data) {
        clients[clients.indexOf(client)].username = data.username;
        clients[clients.indexOf(client)].iconId = data.iconId;
    }

    function create(client) {
        return ClientFactory.createClient(clients[clients.indexOf(client)]);
    }

    function disconnected(client) {
        clients.splice(clients.indexOf(client), 1);
    }

    function getClients() {
        const clientsBuilt = [];
        Object.keys(clients).map(key => clientsBuilt.push(ClientFactory.createClient(clients[key])))
        return clientsBuilt;
    }
}

module.exports = ClientManagerService();
