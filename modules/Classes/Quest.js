class Quest {
    /**
     * 
     * @param {int} duration Durée de la quête, en secondes
     * @param {int} difficulty Difficulté de la quete
     * @param {bool} event Définit si un event peut survenir durant la quete
     */
    constructor(duration,difficulty,event){
        this.duration = duration;
        this.difficulty = difficulty;
        this.event = event;
    }

    getDuration(){
        return this.duration;
    }

    getDifficulty(){
        return this.difficulty;
    }

    getEvent(){
        return this.event;
    }
}