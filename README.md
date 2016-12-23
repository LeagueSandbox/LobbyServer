# The League Sandbox project's lobby server
Project website along with more specifications can be found from: https://leaguesandbox.github.io/  
Project chat on Discord: https://discord.gg/0vmmZ6VAwXB05gB6

# Contributing
We're looking for people interested in contributing to the project.  
Currently the technologies we use include:
* C#
* Lua
* Electron
* Node.js
* Angular
* Socket.io

For more detailed project specifications head over to https://leaguesandbox.github.io/  
If you're interested in contributing, come find us from [Discord](https://discord.gg/0vmmZ6VAwXB05gB6) and let us know

## Running Lobby Server
Lobby Server is, as the name says, the server counterpart for the Lobby Client. 

Steps to get it up and running:
* Run `npm install` in the project root to install all dependencies
* Open `config.json` in `config` folder and write your GameServer.exe path
* Run `server.js` with node using `node server` in the project root

## Project Structure
* `server.js` is the main file of the project and manages most other components
* `lobby.js` runs every lobby and is executed by LobbyFactory.js
* `LobbyManagerService.js`, is the component in charge of managing lobbies
* `LobbyFactory.js` is the component responsible for instantiating new lobbies

## Socket.IO Event Naming Convention Examples
```
lobby.list - Listing of all game lobbies
lobby.create - Create a new game lobby
lobby.edit - Modifying an existing game lobby
lobby.delete - Delete an existing game lobby
```

## GameMode listing
```
{
    "gameModes": {
        "LeagueSandbox-Default": [
            "Dev",
            "1.0.2",
            "1.0.1",
            "1.0.0"
        ],
        "Mythic-Dev": [
            "Dev"
        ],
        "SomeGuy-SomeMode": [
            "0.0.2",
            "0.0.1"
        ]
    }
}
```

## Input definitions
```
{
    "hostSettings": [
        {
            "name": "Gold generation rate",
            "help": "How much gold is generated per 5 seconds in game",
            "field": "text",
            "type": "float",
            "default": "5"
        },
        {
            "name": "Enable gold generation",
            "help": "Should gold generation be enabled?",
            "field": "checkbox",
            "type": "boolean",
            "default": "true" //should allow "true" and "false" only
        },
        {
            "name": "Lives",
            "help": "How many times a player can respawn (-1 for unlimited)",
            "field": "text",
            "type": "integer",
            "default": "-1",
        },
        {
            "name": "Damage multiplier",
            "help": "Global damage multiplier",
            "field": "select",
            "type": "integer",
            "options": {
                "1x": "1",
                "2x": "2",
                "4x": "4",
                "8x": "8"
            },
            "default": "1" // index of selected option
        },
        {
            "name": "Map",
            "help": "The map the game is to be played on",
            "field": "mapSelect",
            "options": "*"
        },
        {
            "name": "Enabled champions",
            "help": "Allowed champions",
            "field": "championSelectMulti",
            "options": "*",
            "default": "*",
            "binding": "enabled-champions"
        },
        {
            "name": "Enabled summoner spells",
            "help": "Allowed summoner spells",
            "field": "spellSelectMulti",
            "options": "*",
            "default": "*",
            "binding": "enabled-spells"
        }
    ],
    "playerSettings": [
        {
            "name": "Champion",
            "help": "Champion you want to play",
            "field": "championSelect",
            "type": "championSelect",
            "options": "{enabled-champions}"
        },
        {
            "name": "Summoner spells",
            "help": "The summoner spells you want to use",
            "field": "summonerSpellSelect",
            "options": "{enabled-spells}",
        }
    ]
}
```
