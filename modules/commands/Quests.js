const Discord = require("discord.js");
const PlayerManager = require("../PlayerManager");
let embed;
let emojis = ["1️⃣","2️⃣","3️⃣"];
let player = PlayerManager.getPlayerByID(message.author.id);

async function questCommand(message){
    if(player != null){
        embed = new Discord.RichEmbed();

        let reponse = await displayReac(message);
        let questIsTaken = false;

        const filter = (reaction, user) => {
            return (reactionIsCorrect(reaction) && user.id === message.author.id);
         };
         const collector = reponse.createReactionCollector(filter, {
            time: 120000
         });

         collector.on('collect', (reaction) => {
                if(!questIsTaken && !player.getOccupationState()){
                    message.channel.send(`Vous avez choisis la quete ${reaction.emoji.name}`);
                    questIsTaken = true;
                    player.setOccupationState(true); // Player is occupied
                }else {
                    message.channel.send(`Vous avez déjà une quete en cours`);
                }
         });

         collector.on('end', () =>{
            reponse.delete();
         });
    }else{
        message.channel.send(`Il semblerait que vous n'avez pas encore créé votre personnage`);
    }

}

const displayReac = function(message){
    if(!player.getOccupationState()){
        embed.setTitle("**Panneau d'affichage des quêtes**");
        embed.setDescription("Vous retrouverez ici toutes les quêtes disponibles.\nPour séléctionner une quête, cliquez sur la réaction correspondante.")
        embed.addField(":one: Quete 1","General description about a guy who has lost his favorite chicken",false);
        embed.addField(":two: Quete 2","General description about a guy who has lost his favorite chicken",false);
        embed.addField(":three: Quete 3","General description about a guy who has lost his favorite chicken",false);
        return message.channel.send(embed).then(async msg =>{
    
            for(i in emojis){
                await msg.react(emojis[i]);
            }
            return msg;
        });
    }
    
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