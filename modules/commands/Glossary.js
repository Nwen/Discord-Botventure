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

/**
 * Edite le message envoyé par le bot avec les informations sur le items en fonction de la page.
 * Ajoute les reactions pour que le joueur puisse naviguer plus facilement entre les pages.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 */
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

/**
 * Décrémente le numéro de la page et affiche la page correspondante.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 */
async function PrevPage(message){
    pageNumber -= 1;
    DisplayGlossary(message);
}

/**
 * Incrémente le numéro de la page et affiche la page correspondate.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 */
async function NextPage(message){
    pageNumber +=1;
    DisplayGlossary(message);
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

 module.exports.GlossaryCommand = GlossaryCommand;