const Ping = require('./commands/Ping')
const CommandTable = new Map(
    [
        ["ping", Ping.PingCommand],
    ]
);

module.exports = CommandTable;