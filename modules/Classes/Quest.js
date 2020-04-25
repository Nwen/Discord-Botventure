const Text = require("../Text/fr.json");

class Quest {
    /**
     * 
     * @param {int} duration Durée de la quête, en secondes
     * @param {int} difficulty Difficulté de la quete
     * @param {bool} event Définit si un event peut survenir durant la quete
     */
    constructor(duration,difficulty,event){
        this.duration = duration * 1000;
        this.difficulty = difficulty;
        this.event = event;
        this.title = "";
        this.description = "";
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
        return this.difficulty;
    }

    getEvent(){
        return this.event;
    }

    getRandomQuest(){
        let rand = Math.floor(Math.random() * 3)+1;
        this.title = Text.quests[String(rand)].title;
        this.description = Text.quests[String(rand)].description;
    }
}

module.exports = Quest;