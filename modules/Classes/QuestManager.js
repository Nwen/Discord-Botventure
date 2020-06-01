const Discord = require('discord.js');
const Player = require("./Player");
const Quest = require("./Quest");
const sqlite3 = require("sqlite3").verbose();

//Ouverture de la base de données 
let db = new sqlite3.Database('./modules/Data/BotVenture.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      return console.error(err.message);
    }
  });


class QuestManager{
    /**
     * Met à jour la base de données pour indiquer que le joueur est entrain d'effectuer une quête.
     * Remplace également les informations de la quête précédente.
     * @param {Player} player Objet Player associé au joueur
     * @param {Quest} quest Quete que le joueur vient de commencer
     */
    startQuest(player,quest){
        db.run('UPDATE Quest SET occupied = ?, startAt = ?, finishAt = ?, duration = ?, difficulty = ?, canEventOccure = ?,title = ?, description = ?, successChance = ?, rewardXp = ?, rewardItem = ?, hpLoss = ? WHERE id = ?',
        ["true", String(new Date().getTime()), String(new Date().getTime() + quest.getDuration()), String(quest.duration), String(quest.difficulty), String(quest.canEventOccure), String(quest.title), String(quest.description), String(quest.successChance), String(quest.rewardXp), String(quest.rewardItem),String(quest.hpLoss),player.getID()]);
    }

    /**
     * Récupère la quête que le joueur est entrain d'effectuer depuis la base de données.
     * @param {Discord.Message} message Message contenant la commande envoyée par le joueur.
     * @returns {Promise<Quest>} Promise contenant la quête.
     */
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

    /**
     * Renvoie un booléen indiquant si le joueur est occupé ou non
     * @param {Player} player Objet Player associé au joueur.
     * @returns {Promise<Boolean>} Promise contenant un booléen.
     */
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

    /**
     * Met a jour l'occupation du joueur dans la base de données.
     * @param {Player} player Objet Player associé au joueur
     */
    setUnoccupied(player){
      db.run('UPDATE Quest SET occupied = ? WHERE id = ?',["false",player.getID()])
    }

    /**
     * Récupère la date et l'heure (en millisecondes) à laquelle se termine la quête du joueur.
     * @param {Player} player Objet Player associé au joueur.
     * @returns {Promise<Number>} Promise contenant la date et l'heure.
     */
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

    /**
     * Récupère la chance de succès de la quête du joueur.
     * @param {Player} player Objet Player associé au joueur.
     * @returns {Promise<Number>} Promise contenant la chance de succès.
     */
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

    /**
     * Récupère l'xp que recevra le joueur si sa quête est réussite.
     * @param {Player} player Objet Player associé au joueur.
     * @returns {Promise<Number>} Promise contenant l'xp.
     */
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