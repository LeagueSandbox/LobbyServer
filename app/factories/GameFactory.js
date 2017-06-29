var fs = require("fs");
var child_process = require("child_process");

exports.startGameServer = function (players, gameServerPort, path, map, lobbyServerPath) {
    if (players) {
        var config = fs.readFileSync("./Config/config.json");
        var configData = JSON.parse(config);
        var objToJSON = new Object();
        objToJSON.players = new Array();
        objToJSON.game = new Object();
        objToJSON.gameInfo = new Object();
        console.log(players)
        for (let i = 0; i < players.length; i++) {
            objToJSON.players[i] = {
                rank: "DIAMOND",
                name: players[i].username,
                champion: dictChamps[players[i].championId],
                team: dictTeams[players[i].teamId],
                skin: players[i].skinId,
                summoner1: "SummonerHeal",
                summoner2: "SummonerFlash",
                ribbon: 2,
                icon: 0,
                runes: fillRune()
            };
        }
        objToJSON["game"]["map"] = map;
        objToJSON["game"]["gameMode"] = "LeagueSandbox-Default";
        objToJSON["gameInfo"]["MANACOSTS_ENABLED"] = true;
        objToJSON["gameInfo"]["COOLDOWNS_ENABLED"] = true;
        objToJSON["gameInfo"]["CHEATS_ENABLED"] = false;
        objToJSON["gameInfo"]["MINION_SPAWNS_ENABLED"] = true;
        var args = [];
        args[0] = "--config"
        args[1] = lobbyServerPath + "/config/GameInfo.json"
        args[2] = "--port";
        args[3] = gameServerPort;
        var readyToJSON = JSON.stringify(objToJSON);
        fs.writeFile("././config/GameInfo.json", readyToJSON, (err) => {
            if (err) throw err;
            child_process.execFile(path, args, { cwd: configData.pathToFolder, maxBuffer: 1024 * 90000 }, (error) => {
                if (error) {
                    throw error;
                }
            });
        });
    }
}
function fillRune() {
    const runes = {};
    for (let i = 1; i <= 30; i++) {
        if (i < 10) {
            runes[i.toString()] = 5245;
        } else if (i < 19) {
            runes[i.toString()] = 5317;
        } else if (i <= 31) {
            runes[i.toString()] = 5289;
        }
    }
    return runes;
}
var dictTeams = {
    0: "BLUE",
    1: "PURPLE"
}
var dictChamps = {
    266: "Aatrox",
    103: "Ahri",
    84: "Akali",
    12: "Alistar",
    32: "Amumu",
    34: "Anivia",
    1: "Annie",
    22: "Ashe",
    268: "Azir",
    53: "Blitzcrank",
    63: "Brand",
    201: "Braum",
    51: "Caitlyn",
    69: "Cassiopeia",
    31: "Chogath",
    42: "Corki",
    122: "Darius",
    131: "Diana",
    36: "DrMundo",
    119: "Draven",
    60: "Elise",
    28: "Evelynn",
    81: "Ezreal",
    9: "FiddleSticks",
    114: "Fiora",
    105: "Fizz",
    3: "Galio",
    41: "Gangplank",
    86: "Garen",
    150: "Gnar",
    79: "Gragas",
    104: "Graves",
    120: "Hecarim",
    74: "Heimerdinger",
    39: "Irelia",
    40: "Janna",
    59: "JarvanIV",
    24: "Jax",
    126: "Jayce",
    222: "Jinx",
    43: "Karma",
    30: "Karthus",
    38: "Kassadin",
    55: "Katarina",
    10: "Kayle",
    85: "Kennen",
    121: "Khazix",
    96: "KogMaw",
    7: "Leblanc",
    64: "LeeSin",
    89: "Leona",
    127: "Lissandra",
    236: "Lucian",
    117: "Lulu",
    99: "Lux",
    54: "Malphite",
    11: "MasterYi",
    21: "MissFortune",
    82: "Mordekaiser",
    25: "Morgana",
    267: "Nami",
    75: "Nasus",
    111: "Nautilus",
    76: "Nidalee",
    56: "Nocturne",
    20: "Nunu",
    2: "Olaf",
    61: "Orianna",
    80: "Pantheon",
    78: "Poppy",
    133: "Quinn",
    33: "Rammus",
    58: "Renekton",
    107: "Rengar",
    92: "Riven",
    68: "Rumble",
    13: "Ryze",
    113: "Sejuani",
    35: "Shaco",
    98: "Shen",
    102: "Shyvana",
    27: "Singed",
    14: "Sion",
    15: "Sivir",
    72: "Skarner",
    37: "Sona",
    16: "Soraka",
    50: "Swain",
    134: "Syndra",
    91: "Talon",
    44: "Taric",
    17: "Teemo",
    412: "Thresh",
    18: "Tristana",
    48: "Trundle",
    23: "Tryndamere",
    4: "TwistedFate",
    29: "Twitch",
    77: "Udyr",
    6: "Urgot",
    110: "Varus",
    67: "Vayne",
    45: "Veigar",
    161: "Velkoz",
    254: "Vi",
    112: "Viktor",
    8: "Vladimir",
    106: "Volibear",
    19: "Warwick",
    62: "MonkeyKing",
    101: "Xerath",
    5: "XinZhao",
    157: "Yasuo",
    83: "Yorick",
    154: "Zac",
    238: "Zed",
    115: "Ziggs",
    26: "Zilean",
    143: "Zyra"
};
