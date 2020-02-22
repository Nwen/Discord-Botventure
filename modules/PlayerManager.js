const Player = require("./Classes/Player");
const DefaultValues = require("./DefaultValues");

let players = {};

function getPlayerByID(id){
    if (players[id] == null){
        addNewPlayer(id);
    }

    return players[id];
}

function addNewPlayer(message, id, name){
    players[id] = new Player(id, name, DefaultValues.player.maxHealth, DefaultValues.player.maxMana, DefaultValues.player.strength,
                             DefaultValues.player.intelligence, DefaultValues.player.stamina, DefaultValues.player.charisma);
}

module.exports.getPlayerByID = getPlayerByID;
module.exports.addNewPlayer = addNewPlayer;