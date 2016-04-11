function LobbyFactory(){

  return {
    createLobby: createLobby
  }

  function createLobby(name){
    var lobby;

    lobby = {
      name: name || "",
      hostSettings: [],
      playerSettings: []
    };

    return lobby;
  }
}

module.exports = LobbyFactory();
