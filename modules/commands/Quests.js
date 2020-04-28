const Discord = require("discord.js");
const PlayerManager = require("../Classes/PlayerManager");
const QuestManager = require("../Classes/QuestManager");
const Quest = require("../Classes/Quest");
let embed;
let emojis = ["1️⃣","2️⃣","3️⃣"];
let newQuest = [0,0,0];

let playerManager = new PlayerManager();
let questManager = new QuestManager();

async function questCommand(message){
    let player = await playerManager.getPlayerByID(message);

    if(player == undefined){
        return message.channel.send(`Il semblerait que vous n'avez pas encore créé votre personnage`);
    }

    /**
     * Quand le joueur fait :quest, on teste s'il a déjà une quete en cours
     * OUI --> on regarde si la quete est finie
     *      OUI --> On affiche s'il a reussi ou non la quete avec les récompenses et pertes d'HP puis on affiche le tableau des quetes pour qu'il puisse en choisir une autre
     *      NON --> On affiche le temps restant
     * NON --> On affiche juste le tableau des quetes
    */
    let isOccupied = await questManager.getOccupationState(player);
    if(isOccupied == "true"){
        let finishTime = parseInt(await questManager.getFinishTime(player));
        if(finishTime < (new Date().getTime())){
            let successChance = await questManager.getSuccessChance(player);
            if (successChance > Math.floor(Math.random() * 100)){
                let rewardXp = await questManager.getRewardXp(player);
                message.channel.send(`Vous avez gagné ${rewardXp} point d'expérience pour avoir fini cette quete !`)
                player.addXp(message,rewardXp);
                playerManager.updatePlayer(player);
            } else {
                message.channel.send("Déso pas déso, les mobs t'ont brisés les os")
            }
            questManager.setUnoccupied(player);
        } else {
            timeDiff(message, finishTime);
        }
    } else {
        showQuests(message,player);
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
    time: 120000
    });

    collector.on('collect', (reaction) => {
        message.channel.send(`:notebook_with_decorative_cover: ${player.getName()}, vous avez choisis la quete ${reaction.emoji.name}`);
        questIsTaken = true;
        switch(reaction.emoji.name){
            case "1️⃣":
                questManager.startQuest(player,newQuest[0]);
                break;
            case "2️⃣":
                questManager.startQuest(player,newQuest[1]);
                break;
            case "3️⃣":
                questManager.startQuest(player,newQuest[2]);
                break;
            default:
                break;
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
        for (i = 0; i<3; i++){
            newQuest[i] = new Quest(1,false);
            embed.addField(`${emojis[i]} ${newQuest[i].title}`, `${newQuest[i].description}\n :hourglass_flowing_sand: ${newQuest[i].showDuration()} | :star: ${newQuest[i].rewardXp} | :warning: ${newQuest[i].getDifficulty()}`)
        }
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

function timeDiff(message,time){
    let diff = Math.floor(Math.abs(new Date().getTime()-time)/1000);
    let secondes = diff % 60;
    let minutes = (diff-secondes)/60;
    return message.channel.send(`Il reste encore ${minutes} minutes et ${secondes} secondes de trajet.`)
}

 module.exports.QuestCommand = questCommand;