const DefaultValues = require("../DefaultValues.json");

/**
 * Represents a Player.
 */
class Player{

    /**
     * Declaring private variables.
     * Use to prevent scripts from modifying the internal data.
     */
    #id;
    #name;
    #race
    #maxHealth;
    #health;
    #maxMana;
    #mana;
    #strength;
    #intelligence;
    #stamina;
    #charisma;
    #isOccupied;
    #xp;
    #level;

    constructor(discordID, name, race, maxHealth, health, maxMana, mana, strength, intelligence, stamina, charisma, xp, level, itemEquipped){
        this.#id = discordID;
        this.#name = name;
        this.#race = race;
        this.#maxHealth = parseInt(maxHealth);
        this.#health = parseInt(health);
        this.#maxMana = parseInt(maxMana);
        this.#mana = parseInt(mana);
        this.#strength = parseInt(strength);
        this.#intelligence = parseInt(intelligence);
        this.#stamina = parseInt(stamina);
        this.#charisma = parseInt(charisma);
        this.#isOccupied = false;
        this.#xp = parseInt(xp);
        this.#level = parseInt(level);
        this.itemEquipped = parseInt(itemEquipped);
    }

    /**
     * Set the Entity's maximum health value.
     * @param maxHealth - The new maximum amount of health this Entity can have. Must be a positive Number.
     */
    setMaxHealth(maxHealth) {
        if (maxHealth > 0) {
            this.#maxHealth = maxHealth;
        }
    }

    /**
     * Returns this Entity's maximum health value.
     * @returns {Number} - How much health this Entity can have.
     */
    getMaxHealth() {
        return this.#maxHealth;
    }

    /**
     * Set the Entity's current health value.
     * @param health - The new amount of health this Entity has. Must be a positive or null Number.
     */
    setHealth(health) {
        if (health >= 0) {
            this.#health = health;
        }
    }

    /**
     * Returns this Entity's maximum mana value.
     * @returns {Number} - How much mana this Entity can have.
     */
    getMaxMana(){
        return this.#maxMana;
    }


    /**
     * Returns the player's id
     * @returns {Number} - The player's id
     */
    getID(){
        return this.#id;
    }

    /**
     * Returns the player's name.
     * @returns {String} - The player's name.
     */
    getName(){
        return this.#name;
    }

    getRace(){
        return this.#race;
    }

    /**
     * Returns the current amount of health this Entity has.
     * @returns {Number} - The current amount of health this Entity has.
     */
    getHealth() {
        return this.#health;
    }

    /**
     * Returns the current amount of mana this Entity has.
     * @returns {Number} - The current amount of mana this Entity has.
     */
    getMana(){
        return this.#mana;
    }

    /**
     * Returns the player's base strength.
     * @returns {Number} - Base strength points the player have.
     */
    getStrength() {
        return this.#strength;
    }

    /**
     * Returns the player's base intelligence.
     * @returns {Number} - Base intelligence points the player have.
     */
    getIntelligence(){
        return this.#intelligence;
    }

    /**
     * Returns the player's base stamina.
     * @returns {Number} - Base stamina points the player have.
     */
    getStamina(){
        return this.#stamina;
    }

    /**
     * Returns the player's base charisma.
     * @returns {Number} - Base charisma points the player have.
     */
    getCharisma(){
        return this.#charisma;
    }

    /**
     * Returns the player's current xp.
     * @returns {Number} - Current xp points the player have.
     */
    getXp(){
        return this.#xp;
    }

    /**
    *  Allow to restore all the health of the entity
    */
    restoreHealthCompletely() {
        this.health = this.maxHealth
    }

    /**
     * Removes the specified amount of points from the entity's health. If the health of the entity is below 0, kill the entity.
     * * Note: If points is negative, then addScore is called.
     * @see addHealthPoints
     * @param points - The amount of health points to remove. Must be a Number.
     */
    removeHealthPoints(points) {
        //console.log(parseInt(points));
        if (parseInt(points) >= 0) {
            this.#health -= parseInt(points);
            if (this.#health <= 0) {
                //this.kill()
            }
        } else {
            this.addHealthPoints(-points);
        }
    }


    /**
     * add the specified amount of points from the entity's health. If the health is higher than the maximum, set the health at the limit
     * * Note: If points is negative, then removeScore is called.
     * @see removeHealthPoints
     * @param points - The amount of health points to add. Must be a Number.
     */

     addHealthPoints(points) {
        if (points >= 0) {
            this.health += parseInt(points);
            if (this.health > this.maxHealth) {
                this.restoreHealthCompletely()
            }
        } else {
            this.removeHealthPoints(-points);
        }
    }

    getOccupationState(){
        return this.#isOccupied;
    }

    setOccupationState(state){
        this.#isOccupied = state;
    }

    setLevel(level){
        if(level > 0){
            this.#level = level;
        }
    }

    /**
     * Returns the player's current level.
     * @returns {Number} - Current level the player have.
     */
    getLevel(){
        return this.#level;
    }

    getXpToLevelUp(level){
        let xp = DefaultValues.xp[level-1];
        console.log(xp);
        return xp;
    }

    addXp(message,xp){
        let xpParsed = parseInt(xp);
        if(xpParsed>0){
            this.setXp(this.#xp + xpParsed);
            console.log(this.getXp());
            if(this.hasEnoughExperienceToLevelUp(this.getLevel())){
                console.log("ouais les levels");
                this.levelUp(message);
            }
        }
    }

    hasEnoughExperienceToLevelUp(level) {
        return (this.getXp() >= this.getXpToLevelUp(level));
    }

    setXp(xp){
        this.#xp = xp;
    }

    levelUp(message){
        this.setXp(this.#xp - this.getXpToLevelUp(this.getLevel()));
        this.#level += 1;
        message.channel.send(`Vous avez gagné un niveau !`);
    }

}

module.exports = Player;