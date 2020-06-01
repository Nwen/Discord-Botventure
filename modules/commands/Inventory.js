const InventoryManager = require("../Classes/InventoryManager");
const PlayerManager = require("../Classes/PlayerManager");
const Inventory = require('../Classes/Inventory');
const Player = require("../Classes/Player");
const ItemList = require("../Data/ItemList.json");
const Discord = require("discord.js");

let invReact = ["⚔️", "🗑️"];
let equipReact = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];
let msgInventory;
let playerManager = new PlayerManager();
let inventoryManager = new InventoryManager();
let embed;

const InventoryCommand = async function(message){
    let inventory = await inventoryManager.getInventory(message);
    embed = new Discord.MessageEmbed();
    msgInventory = await message.channel.send(embed);
    DisplayInventory(message,inventory);
}

/**
 * Envoie un message affichant l'inventaire du joueur.
 * Ajoute des réactions a ce message pour que le joueur puisse intéragir avec son inventaire.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 * @param {Inventory} inventory Inventaire du joueur.
 */
async function DisplayInventory(message, inventory){
    let player = await playerManager.getPlayerByID(message);
    embed = new Discord.MessageEmbed();
    if(player){
        embed.setTitle(`Inventaire de ${player.getName()}`);
        embed.setDescription(`⚔️ : Equipper un objet\n🗑️ : Jeter un objet\n\n**--- Inventaire ---**`)
        for(i=0;i<9;i++){
            embed.addField(`Slot ${i+1}`,DisplaySlot(inventory,i),true);
        }
    } else {
        embed.setTitle("Nous n'avons pas pu trouver votre personnage");
        embed.addField("Si ce n'est pas déjà fait, veuillez commencer l'aventure","`:start`");
    }

    msgInventory.edit(embed);

    slotInterraction(message,inventory,player);
}

/**
 * Renvoie le contenu d'un emplacement de l'inventaire.
 * @param {Inventory} inventory Inventaire du joueur
 * @param {Number} slot Emplacement de l'inventaire
 * @returns {String} Texte indiquant le contenu de l'emplacement.
 */
function DisplaySlot(inventory,slot){
    if(inventory.slots[slot] == 0){
        return "**Empty slot**";
    } else {
        return `** ${ItemList[inventory.slots[slot]].name} ** \n ${ItemList[inventory.slots[slot]].summary}`
    }
}

/**
 * Renvoie un booléen indiquant si l'émoji sert ou non à intéragir avec le programme.
 * @param {Discord.MessageReaction} reaction Reaction soumise par le joueur
 * @param {Array<Discord.Emoji>} emojis Tableau contenant les émojis qui servent a l'intéraction.
 * @returns {Boolean} Booléen indiquant l'utilité de l'émoji.
 */
const reactionIsCorrect = function (reaction,emojis) {
    let contains = false;

    for (reac in emojis) {
       if (emojis[reac] == reaction.emoji.name)
          contains = true;
    }
    
    return contains
 }

 /**
  * Ajoute les réactions au message envoyé par le bot.
  * Gère les effets de ces réactions.
  * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
  * @param {Inventory} inventory Inventaire du joueur.
  * @param {Player} player Objet Player associé au joueur.
  */
async function slotInterraction(message,inventory,player){
    for(reac of invReact){
        await msgInventory.react(reac);
    }

    const filter = (reaction, user) => {
        return (reactionIsCorrect(reaction,invReact) && user.id === message.author.id);
        };

    const collector = msgInventory.createReactionCollector(filter, {time: 120000});

    collector.on("collect", (reaction) => {
        switch(reaction.emoji.name){
            case "⚔️":
                EquipItem(message,inventory,player);
                break;
            case "🗑️":
                DropItem(message,inventory);
                break;
        }
    });
}

/**
 * Actualise le message affichant l'inventaire pour indiquer au joueur qu'il cherche à équipper un objet.
 * Actualise les réactions pour que le joueur puisse choisir un emplacement.
 * Quand le joueur clique sur une réaction, cela remplace son objet équippé par l'objet dans l'emplacement sélectionné
 * et remplace l'objet dans l'emplacement par celui précedemment équipé.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 * @param {Inventory} inventory Inventaire du joueur.
 * @param {Player} player Objet Player associé au joueur.
 */
async function EquipItem(message,inventory,player){
    await msgInventory.reactions.removeAll();
    embed.setDescription("Pour s'équipper d'un objet, cliquez sur la réaction correspondante.\nPar exemple, pour s'équipper de l'objet dans le slot 1, cliquez sur 1️⃣\n\n**--- Inventaire ---**")
    msgInventory.edit(embed);
    for(i = 0; i<9;i++){
        if(inventory.slots[i] != 0){
            await msgInventory.react(equipReact[i]);
        }
    }

    const filter = (reaction, user) => {
        return (reactionIsCorrect(reaction,equipReact) && user.id === message.author.id);
        };

    const collector = msgInventory.createReactionCollector(filter, {time: 120000});

    collector.on("collect", async function(reaction) {
        switch(reaction.emoji.name){
            case "1️⃣":
                inventory.equipItem(player,0);
                break;
            case "2️⃣":
                inventory.equipItem(player,1);
                break;
            case "3️⃣":
                inventory.equipItem(player,2);
                break;
            case "4️⃣":
                inventory.equipItem(player,3);
                break;
            case "5️⃣":
                inventory.equipItem(player,4);
                break;
            case "6️⃣":
                inventory.equipItem(player,5);
                break;
            case "7️⃣":
                inventory.equipItem(player,6);
                break;
            case "8️⃣":
                inventory.equipItem(player,7);
                break;
            case "9️⃣":
                inventory.equipItem(player,8);
                break;
        }
        console.log(player);
        playerManager.updatePlayer(player);
        inventoryManager.updateInventory(message, inventory);
        await msgInventory.reactions.removeAll();
        DisplayInventory(message,inventory);
    });
}

/**
 * Actualise le message affichant l'inventaire pour indiquer au joueur qu'il cherche à équipper un objet.
 * Actualise les réactions pour que le joueur puisse choisir un emplacement.
 * Quand le joueur clique sur une réaction cela va remplacer l'emplacement sélectionné par un emplacement vide.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 * @param {Inventory} inventory Inventaire du joueur.
 */
async function DropItem(message,inventory){
    await msgInventory.reactions.removeAll();
    embed.setDescription("Pour jeter un objet, cliquez sur la réaction correspondante.\nPar exemple, pour jeter l'objet dans le slot 1, cliquez sur 1️⃣\n:warning: Attention cette opération est irreversible ! :warning:\n\n**--- Inventaire ---**")
    msgInventory.edit(embed);
    for(i = 0; i<9;i++){
        if(inventory.slots[i] != 0){
            await msgInventory.react(equipReact[i]);
        }
    }

    const filter = (reaction, user) => {
        return (reactionIsCorrect(reaction,equipReact) && user.id === message.author.id);
        };

    const collector = msgInventory.createReactionCollector(filter, {time: 120000});

    collector.on("collect", async function(reaction){
        switch(reaction.emoji.name){
            case "1️⃣":
                inventory.dropItem(0);
                break;
            case "2️⃣":
                inventory.dropItem(1);
                break;
            case "3️⃣":
                inventory.dropItem(2);
                break;
            case "4️⃣":
                inventory.dropItem(3);
                break;
            case "5️⃣":
                inventory.dropItem(4);
                break;
            case "6️⃣":
                inventory.dropItem(5);
                break;
            case "7️⃣":
                inventory.dropItem(6);
                break;
            case "8️⃣":
                inventory.dropItem(7);
                break;
            case "9️⃣":
                inventory.dropItem(8);
                break;
        }
        inventoryManager.updateInventory(message, inventory);
        await msgInventory.reactions.removeAll();
        DisplayInventory(message,inventory);
    });
}


module.exports.InventoryCommand = InventoryCommand;