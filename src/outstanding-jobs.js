"use strict";

module.exports = class OutstandingJobs {
    // Uses a circular buffer to keep track of the lifetime of outstanding jobs and expires old uncompleted jobs.
    constructor(lifetimeInSeconds, messageQueue, database) {
        this._active = false;
        this._runningIntervalID = null;
        this._messageQueue = messageQueue;
        this._database = database;
        this._outstandingJobsByTime = new Array(lifetimeInSeconds);
        // id : message
        this._outstandingJobs = {};
        this._completedJobs = new Set();
        this._jobBucketMap = {};
        // ~11x faster than map, keep this if you're working with huge configured job lifetimes
        for (let i = 0; i < this._outstandingJobsByTime.length; i++) {
            this._outstandingJobsByTime[i] = new Set();
        }
    }

    start() {
        if (this._active){
            return;
        }
        this._active = true;
        const clearFunc = this._clearExpiredOutstandingJobs.bind(this);
        this._runningIntervalID = setInterval(clearFunc, 1000);
    }

    stop() {
        if (!this._active){
            return;
        }
        this._active = false;
        clearInterval(this._runningIntervalID);
    }

    add(job) {
        if (!this._active) {
            return false;
        }
        this._outstandingJobs[job.id] = job.message;
        const currentSecond = Math.floor((new Date).getTime() / 1000);
        const bucket = (currentSecond - 1) % this._outstandingJobsByTime.length;
        // DO NOT FORGET TO -1 WHEN DETERMINING THE BUCKET OR A NEW MESSAGE CAN BE IMMEDIATELY RETURNED TO THE QUEUE
        this._outstandingJobsByTime[bucket].add(job.id);
        this._jobBucketMap[job.id] = bucket;
        return true;
    }


    confirmJobCompletion(jobIDs) {
        jobIDs.forEach((id) => {
            if (id in this._outstandingJobs) {
                this._completedJobs.add(id);
                // TODO: This might cause some syncing issues if we're altering a bucket and_clearEOJ()
                // happens to be iterating through it at the same time. I could implement some kind of locking
                // but I'm not sure if this is a real problem or how locking would affect performance for high traffic
                this._outstandingJobsByTime[this._jobBucketMap[id]].delete(parseInt(id, 10));
            }
        })
    }

    _clearExpiredOutstandingJobs() {
        const timeBucket = Math.floor((new Date).getTime() / 1000) % this._outstandingJobsByTime.length;
        this._outstandingJobsByTime[timeBucket].forEach((jobID) => {
            if (!(jobID in this._completedJobs)) {
                this._reprocessUnfinishedJobs(jobID);
            }
            else {
                this._processFinishedJobs(jobID);
            }
        });
        this._outstandingJobsByTime[timeBucket].clear();
    }

    _reprocessUnfinishedJobs(jobID) {
        this._messageQueue.unshift({id: jobID, message: this._outstandingJobs[jobID]});
        delete this._outstandingJobs[jobID];
    }

    _processFinishedJobs(jobID) {
        const dbJobsToRemove = [];
        this._completedJobs.delete(jobID);
        dbJobsToRemove.push(jobID);
        if (dbJobsToRemove.length === 1) {
            this._database.remove(dbJobsToRemove[0]);
        }
        else if (dbJobsToRemove.length > 1) {
            this._database.batchRemove(dbJobsToRemove);
        }
    }
};