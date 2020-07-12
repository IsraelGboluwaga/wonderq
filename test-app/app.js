const
    Deque = require("double-ended-queue"),
    startSending = require("./send-simulator"),
    startFetching = require("./fetch-simulator"),
    startProcessingJobs = require("./confirm-simulator");


global.jobQueueGlobal = new Deque();

startSending();
startFetching();
startProcessingJobs();
