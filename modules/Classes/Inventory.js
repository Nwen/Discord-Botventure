class Inventory{

    /**
     * Creation d'un tableau qui va contenir les objets sctockés dans l'inventaire.
     * Chaque objet est représenté par un nombre, qui correspond à son indice dans la liste des objets.
     * L'indice 0 représente un emplacement vide.
     * @param {Array} slots Tableau consitutant les 9 cases de l'inventaire
     */
    constructor(slots){
        this.slots = slots;
    }

    /**
     * Ajout d'un objet dans la première case vide de l'inventaire
     * @param {Number} itemID Indice de l'objet qui est placé dans l'inventaire
     */
    addItem(itemID){
        let emptySlotIndex = this.slots.indexOf(0);
        if(emptySlotIndex == -1){
            console.log("Pas d'empty slot");
            return;
        } else {
            this.slots[emptySlotIndex] = itemID;
        }
    }

    /**
     * Permet au joueur de s'equipper d'un objet présent dans son inventaire
     * @param {Player} player Player voulant s'équipper d'un objet de son inventaire
     * @param {Number} slot Emplacement de l'objet dont le joueur veut s'equipper (0-8)
     */
    equipItem(player, slot){
        let buffer = this.slots[slot];
        this.slots[slot] = player.itemEquipped;
        player.itemEquipped = buffer;
    }

    /**
     * Permet au joueur de se débarasser d'un objet
     * ! L'objet sera perdu et le joueur ne pourra pas le récuperer
     * @param {Number} slot Emplacement de l'objet dont le joueur veut se débarasser (0-8)
     */
    dropItem(slot){
        this.slots[slot] = 0;
    }
}

module.exports = Inventory;