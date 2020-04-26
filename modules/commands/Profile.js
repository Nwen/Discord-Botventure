const PlayerManager = require("../Classes/PlayerManager");
const Discord = require("discord.js");

const ProfileCommand = async function(message){
    let playerManager = new PlayerManager();
    let player = await playerManager.getPlayerByID(message);
    DisplayProfile(message,player);
}

function DisplayProfile(message, player){
    let embed = new Discord.RichEmbed();

    if(player != null){
        let msgStats = `:drop_of_blood: : ${player.getHealth()} / ${player.getMaxHealth()}  |  **${100*player.getHealth()/player.getMaxHealth()} %**\n
                        :droplet: : ${player.getMana()} / ${player.getMaxMana()}  |  **${100*player.getMana()/player.getMaxMana()} %**`;
        let msgXp = `Niveau : ${player.getLevel()} | ${player.getXp()}/${player.getXpToLevelUp(player.getLevel())} :star:`

        let msgCara = `:muscle: : ${player.getStrength()} | :brain: : ${player.getIntelligence()}\n
                       :leg: : ${player.getStamina()}  | :speaking_head: : ${player.getCharisma()}`;
        embed.setTitle(player.getName());
        embed.addField("**--- Statistiques vitales ---**",msgStats, false);
        embed.addField("**--- Expérience ---**", msgXp, false);
        embed.addField("**--- Caractéristiques ---**", msgCara, false);
    } else {
        embed.setTitle("Nous n'avons pas pu trouver votre personnage");
        embed.addField("Si ce n'est pas déjà fait, veuillez rejoindre la partie","`:join <Nom>`");
    }


    message.channel.send(embed);
}

module.exports.ProfileCommand = ProfileCommand;