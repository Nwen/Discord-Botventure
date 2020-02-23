const PlayerManager = require("../PlayerManager");

const JoinCommand = async function(message, args){
    PlayerManager.addNewPlayer(message, message.author.id, args[1]);
}

module.exports.JoinCommand = JoinCommand;