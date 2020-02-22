const Ping = require('./commands/Ping');
const Join = require("./commands/Join");
const Profile = require("./commands/Profile");

const CommandTable = new Map(
    [
        ["ping", Ping.PingCommand],
        ["join", Join.JoinCommand],
        ["profile", Profile.ProfileCommand]
    ]
);

module.exports = CommandTable;