function LobbyFactory(){

  return {
    createLobby: createLobby
  };

  function createLobby(options){
    var lobby;

    lobby = {
      name: options.name || "",
      hostSettings: options.hostSettings || [],
      playerSettings: options.playerSettings || []
    };

    return lobby;
  }
}

module.exports = LobbyFactory();
