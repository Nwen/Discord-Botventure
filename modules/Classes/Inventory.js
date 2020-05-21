class Inventory{

    /**
     * 
     * @param {Array} slots Tableau consitutant les 9 cases de l'inventaire
     */
    constructor(slots){
        this.slots = slots;
    }

    addItem(itemID){
        let emptySlotIndex = this.slots.indexOf(0);
        if(emptySlotIndex == -1){
            console.log("Pas d'empty slot");
            return;
        } else {
            this.slots[emptySlotIndex] = itemID;
        }
    }
}

module.exports = Inventory;