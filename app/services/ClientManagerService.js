function ClientManagerService(){
  var clients = [];

  return {
    connected: connected,
    disconnected: disconnected,
  };

  function connected(client){
    clients.push(client);
  }

  function disconnected(client){
    clients.splice(clients.indexOf(client), 1);
  }
}

module.exports = ClientManagerService();