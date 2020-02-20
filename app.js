const Discord = require('discord.js');
const bot = new Discord.Client();

const config = require("./config.json");
bot.on('ready', () => {
    console.log('Botventure initialised');
})

bot.on('message', message => {
    if (message.content[0] === config.prefix) {
        let args = message.content.substring(config.prefix.length).split(" ");

        previousMessage = message;

        switch (args[0]) {
            case 'ping':
                message.channel.send('pong').catch(console.error);
                break;
            default:
                console.log(args[0]);
                break;
        }
    }
});

bot.login(config.token);