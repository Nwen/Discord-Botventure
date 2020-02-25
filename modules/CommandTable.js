const Ping = require('./commands/Ping');
const Join = require("./commands/Join");
const Profile = require("./commands/Profile");
const Help = require("./commands/Help");

const CommandTable = new Map(
    [
        ["ping", Ping.PingCommand],
        ["join", Join.JoinCommand],
        ["profile", Profile.ProfileCommand],
        ["help", Help.HelpCommand]
    ]
);

module.exports = CommandTable;