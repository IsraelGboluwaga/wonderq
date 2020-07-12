const
    config = require('../../config'),
    util = require('../utilities'),
    route = require('express').Router();

route.post(config.SEND_URL, (req, res) => {
    sendRequestHandle(req, res);
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
        } catch (err) {
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
                messagesGlobal.push(body);
                return msgID
            })
        )
    })
}


function insertInDB(msg) {
    return new Promise((resolve, reject) => {
        // Open connection with a real database
        // Catch any errors while attempting to connect
        setTimeout(resolve, config.DATABASE_SIMULATED_DELAY, DB_CONNECTION_GLOBAL.insert(msg));
        // Catch any errors from failed write to database
        // Close connection and cleanup resources
    });
}


function returnWriteResponse(response, msgID) {
    // Database write failed
    if (typeof msgID === undefined || Number.isNaN(msgID) || msgID === null) {
        response.statusCode = 500;
        response.end();
    } else {
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.end(JSON.stringify({messageID: msgID}))
    }
}

module.exports = route;