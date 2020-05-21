const Inventory = require("./Inventory");
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database('./modules/Data/BotVenture.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

class InventoryManager{
    getInventory(message){
        return new Promise(function(resolve,reject){
            db.get('SELECT * FROM Inventories WHERE id = ?', [`${message.author.id}`], async function(err,row){
                if(row){
                    resolve(new Inventory([row.slot1, row.slot2, row.slot3, row.slot4, row.slot5, row.slot6, row.slot7, row.slot8, row.slot9]));
                }
            });
        });
    }

    updateInventory(message, inventory){
        db.run("UPDATE Inventories SET slot1 = ?, slot2 = ?, slot3 = ?, slot4 = ?, slot5 = ?, slot6 = ?, slot7 = ?, slot8 = ?, slot9 = ? WHERE id = ?", [inventory.slots[0], inventory.slots[1], inventory.slots[2], inventory.slots[3], inventory.slots[4], inventory.slots[5], inventory.slots[6], inventory.slots[7], inventory.slots[8], message.author.id])
    }
}

module.exports = InventoryManager;