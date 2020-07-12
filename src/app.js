'use strict';
const
    config = require('../config'),
    express = require('express'),
    routes = require('./routes'),
    inspector = require('./state-inspector'),
    Deque = require("double-ended-queue"),
    KeyValueDBMock = require('./db-mock'),
    OutstandingJobs = require('./outstanding-jobs');

// Configuration;
const JOB_LIFETIME_IN_SECONDS = config.jobLifetimeSeconds,
    PORT = config.port;

global.messages = new Deque();
global.MAX_MESSAGE_FETCHES = config.maxMessageFetch;
global.dbConnection = new KeyValueDBMock();
global.outstandingJobs = new OutstandingJobs(JOB_LIFETIME_IN_SECONDS, messages, dbConnection);

outstandingJobs.start();

const app = express()
app.use('/', routes);
app.listen(PORT, () => console.log(`Started Message Queue on port ${PORT} \n`))


inspector(messages, dbConnection, outstandingJobs);
