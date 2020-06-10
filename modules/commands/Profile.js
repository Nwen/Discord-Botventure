const PlayerManager = require("../Classes/PlayerManager");
const Player = require('../Classes/Player');
const ItemList = require("../Data/ItemList.json");
const Discord = require("discord.js");
const Canvas = require("canvas");
const Races = require("../Classes/Race");

const bonusCoord = [[230,485],[337,485],[445,485],[550,485],[900,485],[1007,485],[1114,485],[1220,485],[230,650],[337,650],[445,650],[550,650],[900,650],[1007,650],[1114,650],[1220,650]];
const totalCoord = [[105,485],[775,485],[105,650],[775,650]];

const ProfileCommand = async function(message){
    let playerManager = new PlayerManager();
    let player = await playerManager.getPlayerByID(message);
    DisplayProfile(message,player);
}

/**
 * Affiche les informations liées au joueur.
 * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
 * @param {Player} player Objet Player associé au joueur.
 */
async function DisplayProfile(message, player){
    let embed = new Discord.MessageEmbed();

    if(player != null){
        /*let msgStats = `:drop_of_blood: : ${player.getHealth()} / ${player.getMaxHealth()}  |  **${100*player.getHealth()/player.getMaxHealth()} %**\n
                        :droplet: : ${player.getMana()} / ${player.getMaxMana()}  |  **${100*player.getMana()/player.getMaxMana()} %**`;
        let msgXp = `Niveau : ${player.getLevel()} | ${player.getXp()}/${player.getXpToLevelUp(player.getLevel())} :star:`

        let msgCara = `:muscle: : ${player.getStrength()} | :brain: : ${player.getIntelligence()}\n
                       :leg: : ${player.getStamina()}  | :speaking_head: : ${player.getCharisma()}`;
        let msgEquipment = ItemList[player.itemEquipped] ? `:dagger: ${ItemList[player.itemEquipped].name}` : "Empty";
        embed.setTitle(player.getName());
        embed.addField("**--- Statistiques vitales ---**",msgStats, true);
        embed.addField("**--- Caractéristiques ---**", msgCara, true);
        embed.addField("**--- Expérience ---**", msgXp, false);
        embed.addField("**--- Equipement ---**", msgEquipment, false);*/
        let debut = new Date().getTime();
        const canvas = Canvas.createCanvas(1300,740);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('./modules/Images/Profile.png');
        ctx.drawImage(background,0,0, canvas.width, canvas.height);

        const avatar = await Canvas.loadImage(message.author.displayAvatarURL({format: 'jpg'}));
        ctx.drawImage(avatar, 48, 60, 230, 230);

        ctx.font = '60px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';

        //Name of the player
        ctx.fillText(player.getName(),467,60)

        ctx.font = '50px sans-serif';
        /* Text for total stats */
        ctx.fillText(player.getStrength() + Races[player.getRace()].getMod("strength",player) + ItemList[player.itemEquipped].bonus["strength"], totalCoord[0][0], totalCoord[0][1]);
        ctx.fillText(player.getIntelligence() + Races[player.getRace()].getMod("intelligence",player) + ItemList[player.itemEquipped].bonus["intelligence"], totalCoord[1][0], totalCoord[1][1]);
        ctx.fillText(player.getStamina() + Races[player.getRace()].getMod("stamina",player) + ItemList[player.itemEquipped].bonus["stamina"], totalCoord[2][0], totalCoord[2][1]);
        ctx.fillText(player.getCharisma() + Races[player.getRace()].getMod("charisma",player) + ItemList[player.itemEquipped].bonus["charisma"], totalCoord[3][0], totalCoord[3][1]);

        ctx.font = '40px sans-serif';
        /* Text for bonus strength*/
        ctx.fillText(player.getStrength(), bonusCoord[0][0], bonusCoord[0][1]);
        ctx.fillText("/", bonusCoord[1][0], bonusCoord[1][1]);
        ctx.fillText(Races[player.getRace()].getMod("strength",player), bonusCoord[2][0], bonusCoord[2][1]);
        ctx.fillText(ItemList[player.itemEquipped].bonus["strength"], bonusCoord[3][0], bonusCoord[3][1]);
        
        /* Text for bonus intelligence*/
        ctx.fillText(player.getIntelligence(), bonusCoord[4][0], bonusCoord[4][1]);
        ctx.fillText("/", bonusCoord[5][0], bonusCoord[5][1]);
        ctx.fillText(Races[player.getRace()].getMod("intelligence",player), bonusCoord[6][0], bonusCoord[6][1]);
        ctx.fillText(ItemList[player.itemEquipped].bonus["intelligence"], bonusCoord[7][0], bonusCoord[7][1]);
        
        /* Text for bonus stamina*/
        ctx.fillText(player.getStamina(), bonusCoord[8][0], bonusCoord[8][1]);
        ctx.fillText("/", bonusCoord[9][0], bonusCoord[9][1]);
        ctx.fillText(Races[player.getRace()].getMod("stamina",player), bonusCoord[10][0], bonusCoord[10][1]);
        ctx.fillText(ItemList[player.itemEquipped].bonus["stamina"], bonusCoord[11][0], bonusCoord[11][1]);
        
        /* Text for bonus Charisma*/
        ctx.fillText(player.getCharisma(), bonusCoord[12][0], bonusCoord[12][1]);
        ctx.fillText("/", bonusCoord[13][0], bonusCoord[13][1]);
        ctx.fillText(Races[player.getRace()].getMod("charisma",player), bonusCoord[14][0], bonusCoord[14][1]);
        ctx.fillText(ItemList[player.itemEquipped].bonus["charisma"], bonusCoord[15][0], bonusCoord[15][1]);

        
        message.channel.send({files:[{attachment: canvas.toBuffer()}]});

    } else {
        embed.setTitle("Nous n'avons pas pu trouver votre personnage");
        embed.addField("Si ce n'est pas déjà fait, veuillez commencer l'aventure","`:start`");
        message.channel.send(embed);
    }


    //message.channel.send(embed);
}

module.exports.ProfileCommand = ProfileCommand;