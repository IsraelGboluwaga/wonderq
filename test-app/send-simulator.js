const
    config = require("./config"),
    util = require("./utilities"),
    http = require("http");


const sendOptions = {
    host: config.HOST,
    port: config.PORT,
    path: config.SEND_URL,
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
};

function startSending() {
    setInterval(setTimeout, 1000, sendRandomMessages, util.randInt(1, 100) * 100);
}

function sendRandomMessages() {
    const message = {};
    message[util.generateRandomChars(30)] = util.generateRandomChars(30);

    const request = http.request(sendOptions, (response) => {

    });
    request.write(JSON.stringify(message));
    request.end();
    console.log("Sending message: " + JSON.stringify(message));
}

module.exports = startSending;