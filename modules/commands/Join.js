const PlayerManager = require("../PlayerManager");

const JoinCommand = async function(message, args){
    console.log(args[1]);
    if (args[1] != null){
        PlayerManager.addNewPlayer(message, message.author.id, args[1]);
    } else {
        message.channel.send("Veuillez spécifier le nom de votre personnage : `:join <Nom>`\nPour plus d'informations utilisez la commande `:help`");
    }
    
}

module.exports.JoinCommand = JoinCommand;