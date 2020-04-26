const Player = require("./Player");
const DefaultValues = require("../DefaultValues");
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database('./modules/Data/BotVenture.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

class PlayerManager{
    
    getPlayerByID(message){
        return new Promise(function(resolve, reject){
            db.get(`SELECT * FROM Players WHERE id = ?`, [`${message.author.id}`], async function(err,row) {
              if (err) {
                return console.log(err.message);
              }
              // get the last insert id
              if(row){
                resolve(new Player(row.id, row.name, row.race, row.maxHealth, row.health, row.maxMana, row.mana, row.strength, row.intelligence, row.stamina, row.charisma, row.xp, row.level));
              } else {
                resolve(undefined);
              }
            });
          })
    }

    getNewPlayer(message,name,race){
        return new Player(message.author.id, name, race, DefaultValues.player.maxHealth, DefaultValues.player.health, DefaultValues.player.maxMana, DefaultValues.player.mana, DefaultValues.player.strength,
            DefaultValues.player.intelligence, DefaultValues.player.stamina, DefaultValues.player.charisma,
            DefaultValues.player.xp, DefaultValues.player.level)
    }

    addPlayer(player){
        db.run('INSERT INTO Players(id, name, race, maxHealth, health, maxMana, mana, strength, intelligence, stamina, charisma, xp, level) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',[player.getID(),player.getName(),player.getRace(),player.getMaxHealth(),player.getHealth(),player.getMaxMana(),player.getMana(),player.getStrength(),player.getIntelligence(),player.getStamina(),player.getCharisma(),player.getXp(),player.getLevel()]);
        db.run('INSERT INTO Quest(id, occupied, startAt, finishAt, difficulty, event, rewardXp, successChance) VALUES(?,?,?,?,?,?,?,?)',[player.getID(),false,0,0,0,false,0,0]);
    }

    updatePlayer(player){
      db.run('UPDATE Players SET id = ?, name = ?, race = ?, maxHealth = ?, health = ?, maxMana = ?, mana = ?, strength = ?, intelligence = ?, stamina = ?, charisma = ?, xp = ?, level = ? WHERE id = ?',[player.getID(),player.getName(),player.getRace(),player.getMaxHealth(),player.getHealth(),player.getMaxMana(),player.getMana(),player.getStrength(),player.getIntelligence(),player.getStamina(),player.getCharisma(),player.getXp(),player.getLevel(), player.getID()]);
    }
}
//module.exports.getPlayerByID = getPlayerByID;
module.exports = PlayerManager;