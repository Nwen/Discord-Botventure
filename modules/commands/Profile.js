const PlayerManager = require("../PlayerManager");
const Discord = require("discord.js");

const ProfileCommand = async function(message){
    let player = PlayerManager.getPlayerByID(message.author.id);
    DisplayProfile(message,player);
}

function DisplayProfile(message, player){
    let embed = new Discord.RichEmbed();

    if(player != null){
        embed.setTitle(player.getName());
        embed.addField("Health", player.getHealth());
    } else {
        embed.setTitle("Couldn't find your character");
        embed.addField("Please consider join the game");
    }


    message.channel.send(embed);
}

module.exports.ProfileCommand = ProfileCommand;