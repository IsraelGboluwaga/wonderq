const
    config = require("./config"),
    util = require("./utilities"),
    http = require("http");

const confirmOptions = {
    host: config.HOST,
    port: config.PORT,
    path: config.CONFIRM_URL,
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
};

function startProcessingJobs() {
    setInterval(setTimeout, 5500, confirmJobCompletion, util.randInt(1, 100) * 100);
}

function confirmJobCompletion() {
    const message = {};
    const ids = [];
    let messageID;
    for (let i = 0; i < 5; i++) {
        if (jobQueueGlobal.length > 0) {
            messageID = jobQueueGlobal.shift();
            message[messageID] = null;
            ids.push(messageID);
        }
    }
    const request = http.request(confirmOptions, (response) => {
    });
    request.write(JSON.stringify(message));
    request.end();
    console.log("Done processing messages with ID, sending confirmation to Wonder Message Queue:" + JSON.stringify(ids));
}

module.exports = startProcessingJobs;