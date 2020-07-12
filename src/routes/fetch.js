const
    config = require('../../config'),
    util = require('../utilities'),
    urllib = require('url'),
    route = require('express').Router();


route.get(config.FETCH_URL, (req, res) => {
    fetchRequestHandle(req, res);
})


function fetchRequestHandle(request, response) {
    if (messagesGlobal.length <= 0) {
        response.statusCode = 204;
        response.end();
    }
    else {
        const count = urllib.parse(request.url, true).query.count;
        let messageSet = {};

        if (util.isNumeric(count) && count > 1) {
            for (let i = 0; i < Math.min(count, config.MAX_MESSAGE_FETCHES, messagesGlobal.length); i++) {
                messageSet[i] = messagesGlobal.shift();
                outstandingJobsGlobal.add(messageSet[i]);
            }
        }
        else { // Return only one message if no query count is specified
            messageSet[0] = messagesGlobal.shift();
            outstandingJobsGlobal.add(messageSet[0]);
        }
        response.statusCode = 200;
        response.setHeader('content-type', 'application/json');
        response.end(JSON.stringify(messageSet));
    }
}

module.exports = route;