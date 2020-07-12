const
    config = require('../../config'),
    util = require('../utilities'),
    route = require('express').Router();


route.post(config.CONFIRM_URL, (req, res) => {
    confirmRequestHandle(req, res);
})

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
                    outstandingJobsGlobal.confirmJobCompletion(completedJobIds);
                }
            } catch (err) {
                console.log(err);
                response.statusCode = 400;
                response.end();
            }
        });
        response.statusCode = 200;
        response.end();
    } else {
        response.statusCode = 400;
        response.end();
    }
}

module.exports = route;