const PlayerManager = require("../PlayerManager");
const Discord = require("discord.js");

const ProfileCommand = async function(message){
    let player = PlayerManager.getPlayerByID(message.author.id);
    DisplayProfile(message,player);
}

function DisplayProfile(message, player){
    let embed = new Discord.RichEmbed();
    console.log(player);

    if(player != null){
        let msgStats = `:drop_of_blood: : ${player.getHealth()} / ${player.getMaxHealth()}  |  **${100*player.getHealth()/player.getMaxHealth()} %**\n
                        :droplet: : ${player.getMana()} / ${player.getMaxMana()}  |  **${100*player.getMana()/player.getMaxMana()} %**`;

        let msgCara = `:muscle: : ${player.getStrength()} | :brain: : ${player.getIntelligence()}\n
                       :leg: : ${player.getStamina()}  | :speaking_head: : ${player.getCharisma()}`;
        embed.setTitle(player.getName());
        embed.addField("**--- Statistiques vitales ---**",msgStats, false);
        embed.addField("**--- Caractéristiques ---**", msgCara, false);
    } else {
        embed.setTitle("Nous n'avons pas pu trouver votre personnage");
        embed.addField("Si ce n'est pas déjà fait, veuillez rejoindre la partie","`:join <Nom>`");
    }


    message.channel.send(embed);
}

module.exports.ProfileCommand = ProfileCommand;