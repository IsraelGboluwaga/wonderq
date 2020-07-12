const
    config = require('../config'),
    urllib = require('url'),
    util = require('../utilities'),
    routes = require('express').Router();


routes.post(config.sendURL, (req, res) => {
    sendRequestHandle(req, res);
})

routes.post(config.confirmURL, (req, res) => {
    confirmRequestHandle(req, res);
})

routes.get(config.fetchURL, (req, res) => {
    fetchRequestHandle(req, res);
})


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

function insertInDB(msg) {
    return new Promise((resolve, reject) => {
        // Open connection with a real database
        // Catch any errors while attempting to connect
        setTimeout(resolve, config.DatabaseSimulatedDelay, dbConnection.insert(msg));
        // Catch any errors from failed write to database
        // Close connection and cleanup resources
    });
}

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

function fetchRequestHandle(request, response) {
    if (messages.length <= 0) {
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

module.exports = routes;