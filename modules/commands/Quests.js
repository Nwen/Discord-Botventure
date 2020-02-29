const Discord = require("discord.js");
let embed = new Discord.RichEmbed();
const PlayerManager = require("../PlayerManager");
let emojis = ["1️⃣","2️⃣","3️⃣"];

async function questCommand(message){
    embed.setTitle("**Panneau d'affichage des quêtes**");
    embed.setDescription("Vous retrouverez ici toutes les quêtes disponibles.\nPour séléctionner une quête, cliquez sur la réaction correspondante.")
    embed.addField(":one: Quete 1","General description about a guy who has lost his favorite chicken",false);
    embed.addField(":two: Quete 2","General description about a guy who has lost his favorite chicken",false);
    embed.addField(":three: Quete 3","General description about a guy who has lost his favorite chicken",false);

    let reponse = await displayReac(message);
    let questIsTaken = false;

    let player = PlayerManager.getPlayerByID(message.author.id);

    const filter = (reaction, user) => {
        return (reactionIsCorrect(reaction) && user.id === message.author.id);
     };
     const collector = reponse.createReactionCollector(filter, {
        time: 120000
     });

     collector.on('collect', (reaction) => {
        if(player != null){
            if(!questIsTaken && player.getOccupationState()){
                message.channel.send(`Vous avez choisis la quete ${reaction.emoji.name}`);
                questIsTaken = true;
                player.setOccupationState(true); // Player is occupied
            }else if(questIsTaken){
                message.channel.send(`Vous avez déjà choisi une quete`);
            }
        }else{
            message.channel.send(`Il semblerait que vous n'avez pas encore créé votre personnage`);
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