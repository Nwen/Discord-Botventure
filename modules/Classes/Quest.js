const Text = require("../Text/fr.json");

class Quest {

    duration;
    difficulty;
    event;
    title;
    description;
    rewardXp;
    successChance;

    /**
     * 
     * @param {int} duration Durée de la quête, en secondes
     * @param {bool} event Définit si un event peut survenir durant la quete
     */
    constructor(duration,event){
        this.duration = duration * 1000;
        this.difficulty = 0;
        this.event = event;
        this.getRandomQuest();
    }

    getDuration(){
        return this.duration;
    }

    showDuration(){
        let secondes = Math.floor((this.duration/1000))%60;
        let minutes = (Math.floor((this.duration/1000)) - secondes)/60;
        return `${minutes} min et ${secondes} s`;
    }

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

    getEvent(){
        return this.event;
    }

    getRandomQuest(){
        let randomQuest = Math.floor(Math.random() * 3)+1;
        this.title = Text.quests[String(randomQuest)].title;
        this.description = Text.quests[String(randomQuest)].description;
        this.difficulty = Math.floor(Math.random() * 3);
        this.rewardXp = Math.floor(Math.random() * 15)+100 + this.difficulty*10;
        this.successChance = 95 - this.difficulty*5;
    }
}

module.exports = Quest;