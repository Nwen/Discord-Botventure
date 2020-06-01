const Discord = require("discord.js");
const PlayerManager = require("../Classes/PlayerManager");
const QuestManager = require("../Classes/QuestManager");
const InventoryManager = require("../Classes/InventoryManager");
const Quest = require("../Classes/Quest");
const Player = require('../Classes/Player');
const Inventory = require("../Classes/Inventory");
let embed;
let emojis = ["1️⃣","2️⃣","3️⃣"];
let newQuest = [0,0,0];

let playerManager = new PlayerManager();
let questManager = new QuestManager();
let inventoryManager = new InventoryManager();

/**
 * Affiche le tableau des quêtes le temps restant ou le résulat de la quête en cours en fonction de l'état du joueur.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 */
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
            let quest = await questManager.getCurrentQuest(message);
            //let successChance = await questManager.getSuccessChance(player);
            if (quest.successChance > Math.random() * 100){
                //let rewardXp = await questManager.getRewardXp(player);
                message.channel.send(`Vous avez gagné ${quest.rewardXp} point d'expérience pour avoir fini cette quete !`);
                xpReward(message,player,quest);
                itemReward(message);
            } else {
                message.channel.send(`Les monstres t'ont bien niqué ta daronne, tu as perdu ${quest.hpLoss} pv`);
                player.removeHealthPoints(quest.hpLoss);
                playerManager.updatePlayer(player);
            }

            questManager.setUnoccupied(player);
        } else {
            timeDiff(message, finishTime);
        }

    } else {
        showQuests(message,player);
    }

}

/**
 * Affiche le tableau des quêtes et gère la prise de quêtes.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur
 * @param {Player} player Objet Player associé au joueur.
 */
const showQuests = async function(message,player){
    embed = new Discord.MessageEmbed();

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

/**
 * Ajoute l'xp de la récompense de quête au joueur et actualise la base de données.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 * @param {Player} player Objet Player associé au joueur.
 * @param {Quest} quest Quête que le joueur vient de terminer.
 */
const xpReward = function(message,player,quest){
    player.addXp(message,quest.rewardXp);
    playerManager.updatePlayer(player);
}

/**
 * Ajoute un objet aléatoire à l'inventaire du joueur puis actualise la base de données.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 */
const itemReward = async function(message){
    let inventory = await inventoryManager.getInventory(message);
    let rdItem = Math.floor(Math.random() * 3)+1;
    inventory.addItem(rdItem);
    inventoryManager.updateInventory(message, inventory);
}

/**
 * Affiche le panneau de quêtes et ajoute les réactions associées. Renvoie le message envoyé.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 * @param {Player} player Objet Player associé au joueur.
 */
const displayReac = function(message,player){
    if(!player.getOccupationState()){
        embed.setTitle("**:notebook_with_decorative_cover: Panneau d'affichage des quêtes :notebook_with_decorative_cover:**");
        embed.setDescription("Vous retrouverez ici toutes les quêtes disponibles.\nPour séléctionner une quête, cliquez sur la réaction correspondante.");

        for (i = 0; i<3; i++){
            newQuest[i] = Quest.getRandomQuest(player.getLevel());
            embed.addField(`${emojis[i]} ${newQuest[i].title}`, `${newQuest[i].description}\n :hourglass_flowing_sand: ${newQuest[i].showDuration()} | :star: ${newQuest[i].rewardXp} | :warning: ${newQuest[i].getDifficulty()} | 🚩 ${newQuest[i].canEventOccure ? "Possible évenement" : "Aucun évènement"}`)
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

/**
 * Renvoie un booléen indiquant si l'émoji sert ou non à intéragir avec le programme.
 * @param {Discord.MessageReaction} reaction Reaction soumise par le joueur
 * @returns {Boolean} Booléen indiquant l'utilité de l'émoji.
 */
const reactionIsCorrect = function (reaction) {
    let contains = false;

    for (reac in emojis) {
       if (emojis[reac] == reaction.emoji.name)
          contains = true;
    }
    
    return contains
 }

 /**
  * Renvoie le temps restant avant la fin de la quête sous forme de texte lisible par le joueur.
  * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
  * @param {Number} time Date et heure à laquelle se termine la quête (millisecondes).
  * @returns {String} Texte indiquant le temps restant avant la fin de la quête.
  */
function timeDiff(message,time){
    let diff = Math.floor(Math.abs(new Date().getTime()-time)/1000);
    let secondes = diff % 60;
    let minutes = (diff-secondes)/60;
    return message.channel.send(`Il reste encore ${minutes} minutes et ${secondes} secondes de trajet.`)
}

 module.exports.QuestCommand = questCommand;