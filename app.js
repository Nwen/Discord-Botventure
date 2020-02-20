const Discord = require('discord.js');
const bot = new Discord.Client();


const config = require("./config.json");

const CommandHandler = require('./modules/commandHandler')

let commandHandler = new CommandHandler();

bot.on('ready', () => {
    console.log('Botventure initialised');
})

bot.on("message", (message) => {
    if (message.author.bot) return;
    commandHandler.handleMessage(message, bot);
});

bot.login(config.token);