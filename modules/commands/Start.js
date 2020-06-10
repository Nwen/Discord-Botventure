const PlayerManager = require("../Classes/PlayerManager");
const Discord = require('discord.js');
const Text = require("../Text/fr");
const DefaultValues = require("../DefaultValues");

let answers;
const StartCommand = async function(message, args){
    answers = false;
    let playerManager = new PlayerManager();
    if (playerManager.getPlayerByID(message) != undefined){
        return message.channel.send("Vous possédez déjà un personnage");
    }
    getName(message).then(name => getRace(message, name).then(race => {playerManager.addPlayer(playerManager.getNewPlayer(message,name,race))}));
}

/**
 * Creation d'un dialogue indiquant au joueur de choisir un nom.
 * Récupération du nom grâce à un nouveau message envoyé par le joueur.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 * @return {String} Nom choisi par le joueur.
 */
async function getName(message){

    /**
     * On cree un nouvelle Promise basee sur une fonction (ca a l'air d'etre toujours comme ca)
     * Resolve c'est genre un return de quand y a pas d'erreur
     * Reject c'est pareil mais s'il y a une erreur
     */
    return new Promise(function(resolve, reject){
        message.channel.send(Text.commands.start.Intro1 + message.author.username + Text.commands.start.Intro2);
        const collectorName = new Discord.MessageCollector(message.channel, m => (m.author.id == message.author.id && !answers), { time: 60000});
        
        //Premier collecteur pour récuperer le contenu du message du joueur
        //TODO : Ajouter un limiteur de caractères
        collectorName.on('collect', async function(message){
            let fields = [["✅","Confirm this name"],["❎","Nope this wasn't what I wanted"]]
            let confirmName = await displayReac(message,`Votre nom est : ${message.content}`, "Etes vous sur de confirmer ce choix ?",fields,["✅","❎"]);
            answers = true;
    
            const filter = (reaction, user) => {
                return (reactionIsCorrect(reaction,["✅","❎"]) && user.id === message.author.id);
                };
    
            const collectorConfirm = confirmName.createReactionCollector(filter, {
            time: 12000
        });
    
        collectorConfirm.on('collect', (reaction) => {
            collectorConfirm.stop();
            collectorName.stop();
            switch(reaction.emoji.name){
                case "✅":
                    message.channel.send("Confirmation enregistrée");
                    resolve(message.content);
                    break;
                case "❎":
                    answers = false;
                    getName(message);
                    break;
                }
            });
        });
    });
    
}

/**
 * Envoie un message pour laisser au joueur le choix de sa race.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 * @param {String} name Nom choisi précédemment par le joueur.
 * @returns {Promise<String>} Race choisi par le joueur.
 */
async function getRace(message,name){
    return new Promise(async function(resolve,reject){
        message.channel.send(`${name} ${Text.commands.start.getClass1} ${Text.commands.start.getClass2}`);

        let fields = [["👨 | **Humain**",Text.commands.start.human],["🧝 | **Elfe**",Text.commands.start.elf], ["⛏️ | **Nain**", Text.commands.start.dwarf]]
        let confirmClass = await displayReac(message,`${Text.commands.start.getClass3}`, "Chaque race a des facilités dans certains domaines.\n Choisissez en fonction de votre style de jeu",fields,["👨","🧝","⛏"]);

        const filter = (reaction, user) => {
            return (reactionIsCorrect(reaction,["👨","🧝","⛏"]) && user.id === message.author.id);
        };

        const collectorClass = confirmClass.createReactionCollector(filter, {
            time: 12000
        });

        collectorClass.on('collect', (reaction) => {
                collectorClass.stop();
                switch(reaction.emoji.name){
                    case "👨":
                        message.channel.send("Classe enregistrée ! Vous êtes désormais un humain");
                        resolve("human");
                        break;
                    case "🧝":
                        message.channel.send("Classe enregistrée ! Vous êtes désormais un elfe");
                        resolve("elf");
                        break;
                    case "⛏️":
                        message.channel.send("Classe enregistrée ! Vous êtes désormais un nain");
                        resolve("dwarf");
                        break;
                    }
        });
    });
}

/**
 * Creation d'un message Embed et ajouts des reactions si elles sont valides
 * @param {Discord.Message} message Commande start
 * @param {String} title Titre de l'embed
 * @param {String} description Description de l'embed
 * @param {Array<Array>} fields Differentes lignes de texte pour decrire ce que font les reactions
 * @param {Array<Discord.Emoji>} reactions Reactions a ajouter au message pour que le joueur puisse cliquer dessus
 * @return {Discord.Message} Message envoyé.
 */
const displayReac = async function(message,title,description,fields,reactions){
    let embed = new Discord.MessageEmbed();

    embed.setTitle(title);
    embed.setDescription(description);
    for(field of fields){
        embed.addField(field[0],field[1],false);
    }
    return message.channel.send(embed).then(async msg =>{
        for(i in reactions){
            await msg.react(reactions[i]);
        }
        return msg;
    });
};

/**
 * Renvoie un booléen indiquant si l'émoji sert ou non à intéragir avec le programme.
 * @param {Discord.MessageReaction} reaction Reaction soumise par le joueur
 * @returns {Boolean} Booléen indiquant l'utilité de l'émoji.
 */
const reactionIsCorrect = function (reaction, reactions) {
    for (reac in reactions) {
       if (reactions[reac] == reaction.emoji.name)
          return true;
    }
    return false;
 }
module.exports.StartCommand = StartCommand;