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

    equipItem(player, slot){
        buffer = this.slots[slot];
        this.slots[slot] = player.ietmEquipped;
        player.ietmEquipped = buffer;
    }
}

module.exports = Inventory;