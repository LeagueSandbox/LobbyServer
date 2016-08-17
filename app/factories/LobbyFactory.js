function LobbyFactory(){

  return {
    createLobby: createLobby
  };

  function createLobby(options){
    var lobby;

    lobby = {
      //Just for test we disable this
      //name: options.name || "",
      //hostSettings: options.hostSettings || [],
      //playerSettings: options.playerSettings || []
      name: "Demo",
    };

    return lobby;
  }
}

module.exports = LobbyFactory();
