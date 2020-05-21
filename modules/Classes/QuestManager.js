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
        db.run('UPDATE Quest SET occupied = ?, startAt = ?, finishAt = ?, duration = ?, difficulty = ?, canEventOccure = ?,title = ?, description = ?, successChance = ?, rewardXp = ?, rewardItem = ?, hpLoss = ? WHERE id = ?',
        ["true", String(new Date().getTime()), String(new Date().getTime() + quest.getDuration()), String(quest.duration), String(quest.difficulty), String(quest.canEventOccure), String(quest.title), String(quest.description), String(quest.successChance), String(quest.rewardXp), String(quest.rewardItem),String(quest.hpLoss),player.getID()]);
    }

    getCurrentQuest(message){
      return new Promise(function(resolve,reject){
        db.get("SELECT * FROM Quest WHERE id = ?", [`${message.author.id}`], async function(err,row){
          if(row){
            resolve(new Quest(row.duration,row.difficulty,row.canEventOccure,row.title,row.description,row.successChance,row.rewardXp,row.rewardItem,row.hpLoss));
          } else {
            resolve(undefined);
          }
        });
      });
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

    getSuccessChance(player){
      return new Promise(function(resolve, reject){
        db.get('SELECT successChance FROM Quest WHERE id = ?',[`${player.getID()}`],async function(err,row) {
            if (err) {
              return console.log(err.message);
            }

            if(row){
              resolve(row.successChance);
            } else {
              resolve(undefined);
            }
          })
      });
    }

    getRewardXp(player){
      return new Promise(function(resolve, reject){
        db.get('SELECT rewardXp FROM Quest WHERE id = ?',[`${player.getID()}`],async function(err,row) {
            if (err) {
              return console.log(err.message);
            }

            if(row){
              resolve(row.rewardXp);
            } else {
              resolve(undefined);
            }
          })
      });
    }
}

module.exports = QuestManager;