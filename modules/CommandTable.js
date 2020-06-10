const Ping = require('./commands/Ping');
const Start = require("./commands/Start");
const Profile = require("./commands/Profile");
const Help = require("./commands/Help");
const Quests = require("./commands/Quests");
const Inventory = require("./commands/Inventory");
const Glossary = require("./commands/Glossary");
const TestImage = require("./Tests/testImage");

const CommandTable = new Map(
    [
        ["ping", Ping.PingCommand],
        ["start", Start.StartCommand],
        ["profile", Profile.ProfileCommand],
        ["help", Help.HelpCommand],
        ["quest", Quests.QuestCommand],
        ["inventory", Inventory.InventoryCommand],
        ["glossary", Glossary.GlossaryCommand],
        ["test", TestImage.TestImageCommand]
    ]
);

module.exports = CommandTable;