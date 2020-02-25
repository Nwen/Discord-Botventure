const Text = require("../Text/fr.json");

function helpCommand(message, args){
    if (args[1] == null){
        message.channel.send(Text.commands.help.general);
    } else {
        let msg = Text.commands.help.commands[args[1]];
        if(msg == null){
            message.channel.send(":warning: Commande non reconnue :warning:\n\n" + Text.commands.help.general);
        } else{
            message.channel.send(msg);
        }
    }
}

module.exports.HelpCommand = helpCommand;
