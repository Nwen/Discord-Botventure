const Text = require("../Text/fr.json");
const DefaultValues = require("../DefaultValues");

class Quest {

    duration;
    difficulty;
    title;
    description;
    rewardXp;

    /**
     * Récupération d'une quête à partir de la base de données.
     * ! Pour créer une nouvelle quête utilisez la fonction getRandomQuest()
     * @param {int} duration Durée de la quête, en secondes
     * @param {bool} event Définit si un event peut survenir durant la quete
     */
    constructor(duration,difficulty,canEventOccure,title,description,successChance,rewardXp,rewardItem,hpLoss){
        this.duration = duration * 1000;
        this.difficulty = difficulty;
        this.canEventOccure = canEventOccure;
        this.title = title;
        this.description = description;
        this.successChance = successChance;
        this.rewardXp = rewardXp;
        this.rewardItem = rewardItem;
        this.hpLoss = hpLoss;
    }

    /**
     * Crée une nouvelle quête avec des paramètres aléatoire
     * @param {Number} playerLevel Niveau du joueur commençant la quête
     * @returns {Quest} Nouvelle quête
     */
    static getRandomQuest(playerLevel){
        let rdDuration = (Math.floor(Math.random() * 2)+1)*10*60 + Math.floor(Math.random() * 10)*60 + Math.floor(Math.random() * 60); //random duration between 10:00 and 29:59 minutes
        let rdDifficulty = Math.floor(Math.random() * 3);
        let rdCanEventOccure = Math.random() < 0.9 ? false : true;
        let randomQuest = Math.floor(Math.random() * 3)+1;
        let rdTitle = Text.quests[String(randomQuest)].title;
        let rdDescription = Text.quests[String(randomQuest)].description;
        let rdSuccessChance = 195 - rdDifficulty*5;
        let rdRewardXp = DefaultValues.xpPerQuest[playerLevel-1] - 10 + Math.floor(Math.random()*11);
        let rdRewardItem = null;
        let rdHpLoss = 15 - Math.floor(Math.random()*10);
        return new Quest(rdDuration,rdDifficulty,rdCanEventOccure,rdTitle,rdDescription,rdSuccessChance,rdRewardXp,rdRewardItem,rdHpLoss);
    }

    /**
     * Renvoie la durée de la quête en millisecondes
     */
    getDuration(){
        return this.duration;
    }

    /**
     * Renvoie un texte affichant la durée de la quête en minutes et en secondes.
     */
    showDuration(){
        let secondes = Math.floor((this.duration/1000))%60;
        let minutes = (Math.floor((this.duration/1000)) - secondes)/60;
        return `${minutes} min et ${secondes} s`;
    }

    /**
     * Renvoie un texte qui affiche la difficulté de la quête.
     */
    getDifficulty(){
        switch(this.difficulty){
            case 0:
                return "Facile";
            case 1:
                return "Normale";
            case 2:
                return "Difficile";
            default:
                return "Non définie";
        };
    }

    /**
     * Renvoie un booléen indiquant la possibilité qu'un évènement se produise
     */
    getEvent(){
        return this.event;
    }
}

module.exports = Quest;