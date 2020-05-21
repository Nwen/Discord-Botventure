const InventoryManager = require("../Classes/InventoryManager");
const PlayerManager = require("../Classes/PlayerManager");
const ItemList = require("../Data/ItemList.json");
const Discord = require("discord.js");

const InventoryCommand = async function(message){
    let inventoryManager = new InventoryManager();
    let inventory = await inventoryManager.getInventory(message);
    DisplayInventory(message,inventory);
}

async function DisplayInventory(message, inventory){
    let embed = new Discord.RichEmbed();

    if(true){
        //embed.setTitle(player.getName());
        for(i=0;i<9;i++){
            embed.addField(`Slot ${i+1}`,DisplaySlot(inventory,i),true);
        }
    } else {
        embed.setTitle("Nous n'avons pas pu trouver votre personnage");
        embed.addField("Si ce n'est pas déjà fait, veuillez rejoindre la partie","`:join <Nom>`");
    }
    message.channel.send(embed);
}

function DisplaySlot(inventory,slot){
    if(inventory.slots[slot] == 0){
        return "**Empty slot**";
    } else {
        return `** ${ItemList[inventory.slots[slot]].name} ** \n ${ItemList[inventory.slots[slot]].summary}`
    }
}

module.exports.InventoryCommand = InventoryCommand;