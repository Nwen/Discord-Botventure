const Discord = require("discord.js");
let embed = new Discord.RichEmbed();
let emojis = ["1️⃣","2️⃣","3️⃣"];

async function questCommand(message){
    embed.setTitle("**Panneau d'affichage des quêtes**");
    embed.setDescription("Vous retrouverez ici toutes les quêtes disponibles.\nPour séléctionner une quête, cliquez sur la réaction correspondante.")
    embed.addField(":one: Quete 1","General description about a guy who has lost his favorite chicken",false);
    embed.addField(":two: Quete 2","General description about a guy who has lost his favorite chicken",false);
    embed.addField(":three: Quete 3","General description about a guy who has lost his favorite chicken",false);

    let reponse = await displayReac(message);
    let questIsTaken = false;

    const filter = (reaction, user) => {
        return (reactionIsCorrect(reaction) && user.id === message.author.id);
     };
     const collector = reponse.createReactionCollector(filter, {
        time: 120000
     });

     collector.on('collect', (reaction) => {
         if(!questIsTaken){
            message.channel.send(`Vous avez choisis la quete ${reaction.emoji.name}`);
            questIsTaken = true;
         }
     });
}

const displayReac = function(message){
    return message.channel.send(embed).then(async msg =>{

        for(i in emojis){
            await msg.react(emojis[i]);
        }
        return msg;
    });
};

const reactionIsCorrect = function (reaction) {
    let contains = false;
    for (reac in emojis) {
       if (emojis[reac] == reaction.emoji.name)
          contains = true;
    }
    return contains
 }

 module.exports.QuestCommand = questCommand;