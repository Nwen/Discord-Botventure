const Player = require("./Player");
const Quest = require("./Quest");
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database('./modules/Data/BotVenture.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      return console.error(err.message);
    }
  });


class QuestManager{

    startQuest(player,quest){
        db.run('UPDATE Quest SET occupied = ?, startAt = ?, finishAt = ?, difficulty = ?, event = ? WHERE id = ?',["true", String(new Date().getTime()), String(new Date().getTime() + quest.getDuration()),0,"false", player.getID()]);
    }

    getOccupationState(player){
        return new Promise(function(resolve, reject){
            db.get('SELECT occupied FROM Quest WHERE id = ?',[`${player.getID()}`],async function(err,row) {
                if (err) {
                  return console.log(err.message);
                }

                if(row){
                  resolve(row.occupied);
                } else {
                  resolve(undefined);
                }
            })
        });
    }

    setUnoccupied(player){
      db.run('UPDATE Quest SET occupied = ? WHERE id = ?',["false",player.getID()])
    }

    getFinishTime(player){
      return new Promise(function(resolve, reject){
        db.get('SELECT finishAt FROM Quest WHERE id = ?',[`${player.getID()}`],async function(err,row) {
            if (err) {
              return console.log(err.message);
            }

            if(row){
              resolve(row.finishAt);
            } else {
              resolve(undefined);
            }
          })
      });
    }
}

module.exports = QuestManager;