const InventoryManager = require("../Classes/InventoryManager");
const PlayerManager = require("../Classes/PlayerManager");
const ItemList = require("../Data/ItemList.json");
const Discord = require("discord.js");

let invReact = ["⚔️", "🗑️"];
let equipReact = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];
let msgInventory;

const InventoryCommand = async function(message){
    let inventoryManager = new InventoryManager();
    let inventory = await inventoryManager.getInventory(message);
    DisplayInventory(message,inventory);
}

async function DisplayInventory(message, inventory){
    let embed = new Discord.MessageEmbed();
    let playerManager = new PlayerManager();
    let player = playerManager.getPlayerByID(message);

    if(player){
        //embed.setTitle(player.getName());
        for(i=0;i<9;i++){
            embed.addField(`Slot ${i+1}`,DisplaySlot(inventory,i),true);
        }
    } else {
        embed.setTitle("Nous n'avons pas pu trouver votre personnage");
        embed.addField("Si ce n'est pas déjà fait, veuillez commencer l'aventure","`:start`");
    }

    msgInventory = await message.channel.send(embed);

    slotInterraction(message);
}

function DisplaySlot(inventory,slot){
    if(inventory.slots[slot] == 0){
        return "**Empty slot**";
    } else {
        return `** ${ItemList[inventory.slots[slot]].name} ** \n ${ItemList[inventory.slots[slot]].summary}`
    }
}

const reactionIsCorrect = function (reaction,emojis) {
    let contains = false;

    for (reac in emojis) {
       if (emojis[reac] == reaction.emoji.name)
          contains = true;
    }
    
    return contains
 }

async function slotInterraction(message){
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
                EquipItem(message);
                break;
            case "🗑️":
                console.log("Jeter l'objet");
                break;
        }
    });
}

function EquipItem(message){
    msgInventory.reactions.removeAll();
}


module.exports.InventoryCommand = InventoryCommand;