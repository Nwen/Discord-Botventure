const Discord = require("discord.js");
const PlayerManager = require("../PlayerManager");
let embed;
let emojis = ["1️⃣","2️⃣","3️⃣"];


function questCommand(message){
    let player = PlayerManager.getPlayerByID(message.author.id);

    if(player != undefined){
        showQuests(message,player);
    }else{
        message.channel.send(`Il semblerait que vous n'avez pas encore créé votre personnage`);
    }
}

const showQuests = async function(message,player){
    embed = new Discord.RichEmbed();

    let reponse = await displayReac(message,player);
    let questIsTaken = false;

    const filter = (reaction, user) => {
        return (reactionIsCorrect(reaction) && user.id === message.author.id);
        };
        const collector = reponse.createReactionCollector(filter, {
        time: 12000
        });

        collector.on('collect', (reaction) => {
            if(!questIsTaken && !player.getOccupationState()){
                message.channel.send(`:notebook_with_decorative_cover: ${player.getName()}, vous avez choisis la quete ${reaction.emoji.name}`);
                questIsTaken = true;
                player.setOccupationState(true); // Player is occupied
            }else {
                message.channel.send(`Vous avez déjà une quete en cours`);
            }
        });

        collector.on('end', () =>{
            reponse.delete();
        });
}

const displayReac = function(message,player){
    if(!player.getOccupationState()){
        embed.setTitle("**:notebook_with_decorative_cover: Panneau d'affichage des quêtes :notebook_with_decorative_cover:**");
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
    } else {
        message.channel.send(`Vous avez déjà une quete en cours`);
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