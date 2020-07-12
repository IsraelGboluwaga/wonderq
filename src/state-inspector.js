"use strict";

const COMMAND_NAMES = {
    database: "database",
    view_queue: "view-queue",
    pending_jobs: "pending-jobs",
    cmds: "cmds",
    pause: "pause",
}

function activateInspector(queue, db, jobs) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('error', (err) => {
        console.log(err);
    }).on('data', (command) => {
        switch (command.trim().toLowerCase()) {
            case COMMAND_NAMES['database']:
                console.log(JSON.stringify(db, null, 4));
                break;
            case COMMAND_NAMES['view_queue']:
                console.log(queue);
                break;
            case COMMAND_NAMES['pending-jobs']:
                printPendingJobList(jobs);
                break;
            case COMMAND_NAMES['cmds']:
                printCommands();
                break;
            case COMMAND_NAMES['pause']:
                // TODO
                break
            default:
                console.log('Command not found')
        }
    });
    printCommands();
}

function printCommands() {
    console.log(`Commands:
    ${COMMAND_NAMES['view_queue']}   - View messages in MQ. 
    ${COMMAND_NAMES['database']}     - View persisted messages. 
    ${COMMAND_NAMES['pending_jobs']} - View jobs being processed by consumers
    ${COMMAND_NAMES['cmds']}         - Reprint command list.
    ${COMMAND_NAMES['pause']}        - TODO`);
}

function printPendingJobList(jobs) {
    const len = jobs._outstandingJobsByTime.length;
    const currentBucket = Math.floor((new Date).getTime() / 1000) % len;
    for (let i = 0; i < len; i++) {
        if (jobs._outstandingJobsByTime[i].size > 0) {
            if (currentBucket < i) {
                console.log("Time to live: " + (i - currentBucket) + " seconds.");
                console.log(jobs._outstandingJobsByTime[i]);
            } else if (i < currentBucket) {
                console.log("Time to live: " + (len - currentBucket + i) + " seconds.");
                console.log(jobs._outstandingJobsByTime[i]);
            }
        }
    }
}

module.exports = activateInspector;