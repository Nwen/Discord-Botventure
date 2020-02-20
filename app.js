const Discord = require('discord.js');
const bot = new Discord.Client();

const config = require("./config.json");

bot.on('ready', () => {
    console.log('Doomsday protocole initiated\nWHAT HAVE I DONE');
    bot.user.setActivity('the world burn', { type: 'WATCHING' }).catch(console.error);
})

bot.on('message', message => {
    if (message.content[0] === config.prefix) {
        let args = message.content.substring(PREFIX.length).split(" ");

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