class Race{
    /**
     * 
     * @param {string} name The name of the race
     * @param {dictionary} statImportance Define how the stats will increase
     */
    
    constructor(name,statImportance){
        this.name = name;
        this.statImportance = statImportance;
    }

    getMod(stat,player){
        switch(statImportance[stat]){
            case -1:
                return Math.floor(player.getLevel()/5);
            case 0:
                return Math.floor(player.getLevel()/3);
            case 1:
                return Math.floor(player.getLevel()/2);
        }
    }
}

module.exports = Race;