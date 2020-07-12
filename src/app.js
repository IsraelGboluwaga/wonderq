'use strict';
const
    config = require('../config'),
    express = require('express'),
    routes = require('./routes'),
    inspector = require('./state-inspector'),
    Deque = require("double-ended-queue"),
    KeyValueDBMock = require('./db-mock'),
    OutstandingJobs = require('./outstanding-jobs');


global.messagesGlobal = new Deque();
global.DB_CONNECTION_GLOBAL = new KeyValueDBMock();
global.outstandingJobsGlobal = new OutstandingJobs(config.JOB_LIFETIME_SECONDS, messagesGlobal, DB_CONNECTION_GLOBAL);

outstandingJobsGlobal.start();

const app = express()
app.use('/', routes);
app.listen(config.PORT, () => console.log(`Started Message Queue on port ${config.PORT} \n`))


inspector(messagesGlobal, DB_CONNECTION_GLOBAL, outstandingJobsGlobal);
