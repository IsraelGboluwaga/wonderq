const http = require("http");
const Deque = require("double-ended-queue");

const HOST = "localhost";
const PORT = 8086;
const FETCH_COUNT = 5;
const jobQueue = new Deque();

const sendOptions = {
    host: HOST,
    port: PORT,
    path: "/send",
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
};

const fetchOptions = {
    host: HOST,
    port: PORT,
    path: "/fetch?count=" + FETCH_COUNT,
    method: "GET",
};

const confirmOptions = {
    host: HOST,
    port: PORT,
    path: "/confirm",
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    }
};

startSending();
startFetching();
startProcessingJobs();

function startSending() {
    setInterval(setTimeout, 1000, sendRandomMessages, randInt(1, 100) * 100);
}

function startFetching() {
    setInterval(setTimeout, 2000, fetchMessages, randInt(1, 100) * 100);
}

function startProcessingJobs() {
    setInterval(setTimeout, 5500, confirmJobCompletion, randInt(1, 100) * 100);
}

function sendRandomMessages() {
    const message = {};
    message[generateRandomChars(30)] = generateRandomChars(30);

    const request = http.request(sendOptions, (response) => {

    });
    request.write(JSON.stringify(message));
    request.end();
    console.log("Sending message: " + JSON.stringify(message));
}

function fetchMessages() {
    const request = http.request(fetchOptions, (response) => {
        let responseString = "";

        response.on("error", (err) => {
            console.error(err);
        }).on("data", function (data) {
            responseString += data;
        }).on("end", function () {
            if (response.statusCode === 200) {
                const obj = JSON.parse(responseString);
                Object.keys(obj).forEach((key) => {
                    jobQueue.push(obj[key].id);
                    console.log("Fetched message: " + JSON.stringify(obj[key]));

                })
            }
        });
    });
    request.end();
}

function confirmJobCompletion() {
    const message = {};
    const ids = [];
    let messageID;
    for (let i = 0; i < 5; i++) {
        if (jobQueue.length > 0) {
            messageID = jobQueue.shift();
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

function generateRandomChars(len) {
    let text = "";
    let base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let i = 0; i < randInt(0, len); i++)
        text += base.charAt(randInt(0, base.length));

    return text;
}

function randInt(start, end) {
    return Math.floor(Math.random() * (end-start)) + start;
}