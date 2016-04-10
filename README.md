# LobyServer

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
            "type": "integer"
            "default": "-1",
        },
        {
            "name": "Damage multiplier",
            "help": "Global damage multiplier",
            "field": "select",
            "type": "integer",
            "options": [
                "1x": "1",
                "2x": "2",
                "4x": "4",
                "8x": "8"
            ]
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