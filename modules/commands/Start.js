const PlayerManager = require("../PlayerManager");
const Text = require("../Text/fr");
const Discord = require("discord.js");

let answers;
const StartCommand = async function(message, args){
    /**console.log(args[1]);
    *if (args[1] != null){
    *    PlayerManager.addNewPlayer(message, message.author.id, args[1]);
    *} else {
    *    message.channel.send("Veuillez spécifier le nom de votre personnage : `:join <Nom>`\nPour plus d'informations utilisez la commande `:help`");
    *}
    */
    answers = [false,false];
    getName(message).then(name => getRace(message, name).then(classe => console.log(classe)));
}

async function getName(message){
    return new Promise(function(resolve, reject){
        message.channel.send(Text.commands.start.Intro1 + message.author.username + Text.commands.start.Intro2);
        const collectorName = new Discord.MessageCollector(message.channel, m => (m.author.id == message.author.id && !answers[0]), { time: 60000});
    
        collectorName.on('collect', async function(message){
            let fields = [["✅","Confirm this name"],["❎","Nope this wasn't what I wanted"]]
            let confirmName = await displayReac(message,`Votre nom est : ${message.content}`, "Etes vous sur de confirmer ce choix ?",fields,["✅","❎"]);
            answers[0] = true;
    
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
                    answers[0] = false;
                    getName(message);
                    break;
                }
            });
            //test(message).then(message.channel.send("bouh"));
        });
    });
    
}

async function getRace(message,name){
    return new Promise(async function(resolve,reject){
        message.channel.send(`${name} ${Text.commands.start.getClass1} ${Text.commands.start.getClass2}`);

        let fields = [["👨 | **Humain**",Text.commands.start.human],["🧝 | **Elfe**",Text.commands.start.elf], ["⛏️ | **Nain**", Text.commands.start.dwarf]]
        let confirmClass = await displayReac(message,`${Text.commands.start.getClass3}`, "Chaque race a des facilités dans certains domaines.\n Choisissez en fonction de votre style de jeu",fields,["👨","🧝","⛏"]);
        answers[1] = true;

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
                        resolve("Humain");
                        break;
                    case "🧝":
                        message.channel.send("Classe enregistrée ! Vous êtes désormais un elfe");
                        resolve("Elfe");
                        break;
                    case "⛏️":
                        message.channel.send("Classe enregistrée ! Vous êtes désormais un nain");
                        resolve("Nain");
                        break;
                    }
        });
    });
}

const displayReac = async function(message,title,description,fields,reactions){
    let embed = new Discord.RichEmbed();

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

const reactionIsCorrect = function (reaction, reactions) {
    for (reac in reactions) {
       if (reactions[reac] == reaction.emoji.name)
          return true;
    }
    return false;
 }
module.exports.StartCommand = StartCommand;