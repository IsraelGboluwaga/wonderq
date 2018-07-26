"use strict";

function activateInspector(queue, db, jobs) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('error', (err) => {
        console.log(err);
    }).on('data', (command) => {
        switch(command.trim().toLowerCase()) {
            case "database":
                console.log(JSON.stringify(db, null, 4));
                break;
            case "view-queue":
                console.log(queue);
                break;
            case "pending-jobs":
                printPendingJobList(jobs);

                break;
            case "cmds":
                printCommands();
                break;
            case "pause":
                // TODO
                break
        }
    });
    printCommands();
}

function printCommands() {
    console.log("Commands: \n queue    - View messages in MQ. \n database - View persisted messages. " +
        "\n pending  - View jobs being processed by consumers" +
        "\n cmds     - Reprint command list. \n pause    - TODO");
}

function printPendingJobList(jobs) {
    const len = jobs._outstandingJobsByTime.length;
    const currentBucket = Math.floor((new Date).getTime() / 1000) % len;
    for (let i = 0; i < len; i++) {
        if (jobs._outstandingJobsByTime[i].size > 0) {
            if (currentBucket < i) {
                console.log("Time to live: " + (i - currentBucket) + " seconds.");
                console.log(jobs._outstandingJobsByTime[i]);
            }
            else if (i < currentBucket) {
                console.log("Time to live: " + (len - currentBucket + i) + " seconds.");
                console.log(jobs._outstandingJobsByTime[i]);
            }
        }
    }
}

module.exports = activateInspector;