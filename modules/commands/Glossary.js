const Discord = require("discord.js");
const ItemList = require("../Data/ItemList.json");

let embed = new Discord.MessageEmbed();
let pageNumber = 1;
let msgGlossary;
let numbers = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];
let maxPage = Math.floor(Object.keys(ItemList).length/5)+1;

async function GlossaryCommand(message, args){
    msgGlossary = await message.channel.send(embed);
    DisplayGlossary(message);
}

async function DisplayGlossary(message){
    embed = new Discord.MessageEmbed();
    embed.setTitle(`Page n° ${pageNumber}`);
    for(i = (pageNumber-1)*5 + 1; i < (pageNumber-1)*5 + 6 && i < Object.keys(ItemList).length + 1; i++){
        embed.addField(`[${i}] ${ItemList[`${i}`].name}`, `${ItemList[`${i}`].description}`, false);
    }
    msgGlossary.edit(embed);

    let pageNumberStr = String(pageNumber).padStart(2,'0');

    if(pageNumber > 1){
        await msgGlossary.react("⬅");
    }
    /*for(i=0;i<2;i++){
        await msgGlossary.react(numbers[parseInt(pageNumberStr.substr(i,i+1))]); // Affichage plus stylé mais moins opti du nombre de page
    }*/
    if(pageNumber < maxPage){
        await msgGlossary.react("➡");
    }

    const filter = (reaction, user) => {
        return (reactionIsCorrect(reaction,["⬅","➡"]) && user.id === message.author.id);
        };

    const collector = msgGlossary.createReactionCollector(filter, {time: 600000});

    collector.on("collect", async function(reaction) {
        await msgGlossary.reactions.removeAll();
        switch(reaction.emoji.name){
            case "⬅":
                if(pageNumber != 1){
                    collector.stop();
                    PrevPage(message);
                }
                break;
            case "➡":
                collector.stop();
                NextPage(message);
                break;
        }
    });
}

async function PrevPage(message){
    pageNumber -= 1;
    DisplayGlossary(message);
}

async function NextPage(message){
    pageNumber +=1;
    DisplayGlossary(message);
}

const reactionIsCorrect = function (reaction,emojis) {
    let contains = false;

    for (reac in emojis) {
       if (emojis[reac] == reaction.emoji.name)
          contains = true;
    }
    
    return contains
 }

 module.exports.GlossaryCommand = GlossaryCommand;