class Race{
    /**
     * 
     * @param {string} name The name of the race
     * @param {Dictionary} statImportance Define how the stats will increase
     */
    
    constructor(statImportance){
        this.statImportance = statImportance;
    }

    getMod(stat,level){
        switch(this.statImportance[stat]){
            case -1:
                return Math.floor(Math.sin(level*Math.PI/16) + level/2);
            case 0:
                return Math.floor(Math.sin(level*Math.PI/12) + level/2);
            case 1:
                return Math.floor(Math.sin(level*Math.PI/8) + level/2);
        }
    }
}

const Races = {"human": new Race({"maxHealth":0,"maxMana":0,"strength":0,"intelligence":0,"stamina":0,"charisma":0}),
               "dwarf": new Race({"maxHealth":1,"maxMana":0,"strength":1,"intelligence":-1,"stamina":-1,"charisma":0}),
               "elf": new Race({"maxHealth":-1,"maxMana":1,"strength":-1,"intelligence":1,"stamina":0,"charisma":0})};

module.exports = Races;