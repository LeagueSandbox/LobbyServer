function ClientFactory() {

    return {
        createClient
    };
    function createClient(clientInfo) {
        const client = {
            id: clientInfo.playerId,
            username: clientInfo.username,
            iconId: clientInfo.iconId
        };
        return client;
    }
}
module.exports = ClientFactory();
