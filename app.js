'use strict';
const
    config = require('./config'),
    http = require('http'),
    urllib = require('url'),
    inspector = require('./state-inspector'),
    Deque = require("double-ended-queue"),
    KeyValueDBMock = require('./db-mock'),
    OutstandingJobs = require('./outstanding-jobs'),
    util = require('./utilities');

// Configuration;
const JOB_LIFETIME_IN_SECONDS = config.jobLifetimeSeconds,
    PORT = config.port,
    MAX_MESSAGE_FETCHES = config.maxMessageFetch;

const messages = new Deque();
const dbConnection = new KeyValueDBMock();
const outstandingJobs = new OutstandingJobs(JOB_LIFETIME_IN_SECONDS, messages, dbConnection);
const jobOwner = {}; //Feature to add

// Initialize processes
outstandingJobs.start();
http.createServer(handleRequest).listen(PORT);
console.log(`Started Message Queue on port ${PORT} \n`);

// HTTP Router
function handleRequest(request, response) {
    const { method } = request;
    const urlParts = urllib.parse(request.url, true);

    if (method === 'POST') {
        if (urlParts.pathname.toLowerCase() === config.sendURL) {
            sendRequestHandle(request, response);
        }
        else if (urlParts.pathname.toLowerCase() === config.confirmURL) {
            confirmRequestHandle(request, response);
        }
        else {
            response.statusCode = 404;
            response.end();
        }
    }
    else if (method === 'GET') {
        if (urlParts.pathname.toLowerCase() === config.fetchURL) {
            fetchRequestHandle(request, response);
        }
        else {
            response.statusCode = 404;
            response.end();
        }
    }
    else {
        response.statusCode = 404;
        response.end();
    }
}

// Receives messages sent from producers
function sendRequestHandle(request, response) {
    const body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        try {
            // It's possible the content-type isn't reflective of the actual request body data
            // In retrospect, I should have just used Express/body-parser
            const messageJson = util.convertBytesToJson(body);
            addToQueue(messageJson).then((msgID) => {
                returnWriteResponse(response, msgID);
            });
        }
        catch (err) {
            console.log(err);
            response.statusCode = 400;
            response.end();
        }
    });
}

// Adds a message to the message queue
function addToQueue(msg) {
    return new Promise((resolve, reject) => {
        resolve(insertInDB(msg)
            .then((msgID) => {
                let body = {id: msgID, message: msg};
                messages.push(body);
                return msgID
            })
        )
    })
}

// Persists the message to the database
function insertInDB(msg) {
    return new Promise((resolve, reject) => {
        // Open connection with a real database
        // Catch any errors while attempting to connect
        setTimeout(resolve, config.DatabaseSimulatedDelay, dbConnection.insert(msg));
        // Catch any errors from failed write to database
        // Close connection and cleanup resources
    });
}

// Sends the result of a write request to the producer
function returnWriteResponse(response, msgID) {
    // Database write failed
    if (typeof msgID === undefined || Number.isNaN(msgID) || msgID === null) {
        response.statusCode = 500;
        response.end();
    }
    else {
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.end(JSON.stringify({ messageID:  msgID }))
    }
}

// Requests for messages from consumers
function fetchRequestHandle(request, response) {
    if (messages.length <= 0) {
        // There are no messages sitting in the queue
        response.statusCode = 204;
        response.end();
    }
    else {
        const count = urllib.parse(request.url, true).query.count;
        let messageSet = {};

        if (util.isNumeric(count) && count > 1) {
            for (let i = 0; i < Math.min(count, MAX_MESSAGE_FETCHES, messages.length); i++) {
                messageSet[i] = messages.shift();
                outstandingJobs.add(messageSet[i]);
            }
        }
        else { // Return only one message if no query count is specified
            messageSet[0] = messages.shift();
            outstandingJobs.add(messageSet[0]);
        }
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.end(JSON.stringify(messageSet));
    }
}

// Handles confirmations from consumers indicating that a message was successfully processed
function confirmRequestHandle(request, response) {
    if (request.headers['content-type'] === 'application/json') {
        const body = [];
        request.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            const completedJobIds = [];
            try {
                const messageJson = JSON.parse(body);
                for (let key in messageJson) {
                    if (messageJson.hasOwnProperty(key) && util.isNumeric(key)) {
                        completedJobIds.push(key);
                    }
                }
                if (completedJobIds.length > 0) {
                    outstandingJobs.confirmJobCompletion(completedJobIds);
                }
            } catch (err) {
                console.log(err);
                response.statusCode = 400;
                response.end();
            }
        });
        response.statusCode = 200;
        response.end();
    }
    else {
        response.statusCode = 400;
        response.end();
    }
}



inspector(messages, dbConnection, outstandingJobs);



