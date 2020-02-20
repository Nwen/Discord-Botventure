const Config = require('../config.json');
const CommandTable = require('./CommandTable.js')

class CommandHandler {
    constructor() {

    }

    async handleMessage(message, bot) {
        if (message.content.substr(0, 1) === Config.prefix) {
            console.log(message.content); //log du contenu du messgae dans la console
            launchCommand(message, bot);
        }
    }

    static getCommandFromMessage(message) {
        return CommandHandler.getArgsFromMessage(message).shift().toLowerCase();
    }

    static getArgsFromMessage(message) {
        return message.content.slice(Config.prefix.length).trim().split(/ +/g);
    }
}

function launchCommand(message, bot) {
    let command = CommandHandler.getCommandFromMessage(message);
    let args = CommandHandler.getArgsFromMessage(message);
    if (CommandTable.has(command))
        if (!message.channel.permissionsFor(bot.user).serialize().SEND_MESSAGES) { //test if the bot can speak in the channel where a command has been read
            message.author.send("Je n'ai pas la permission d'envoyer de messages ici");
        } else {
            CommandTable.get(command)(message, args, bot);
        }
}

module.exports = CommandHandler;