const pingCommand = async function (message) {
    let pingMessage = "Pong";
    displayPing(message, pingMessage);
};

function displayPing(message, pingMessage) {

    message.channel.send(pingMessage).then(msg => {
        let pingValue = calculateTimeDifferenceBetweenTwoMessages(message, msg);
        msg.edit(pingMessage + " | " + pingValue + " ms");
    })

}

function calculateTimeDifferenceBetweenTwoMessages(messageOne, messageTwo) {

    let startTime = messageOne.createdTimestamp;
    let endTime = messageTwo.createdTimestamp;
    let pingValue = endTime - startTime;
    return pingValue;

}

module.exports.PingCommand = pingCommand;