"use strict";
/**
 * @db-mock.js
 *
 * Key-value database mock.
 */
module.exports = class KeyValueDBMock {
    constructor () {
        this._objectId = 0;
        this._store = {};
    }

    /**
     * Inserts a message into the database.
     *
     * @param val - The message to be stored.
     * @returns {number} - The auto-incremented id (key) associated with the stored message.
     */
    insert(val) {
        this._objectId += 1;
        this._store[this._objectId] = val;
        return this._objectId;
    }

    /**
     * Inserts multiple messages into the database at once.
     *
     * @param vals - An array of messages to be stored.
     * @returns {Array} - An array of ids associated with the stored messages.
     */
    writeBulk(vals) {
        const objIds = [];
        vals.forEach((val) => {
            this._objectId += 1;
            this._store[this._objectId] = val;
            objIds.push(this._objectId);
        });
        return objIds;
    }

    /**
     * Removes a job from the database.
     * @param key
     */
    remove(key) {
        delete this._store[key];
    }

    /**
     * Removes multiple jobs at once from the database.
     * @param keys
     */
    batchRemove(keys) {
        keys.forEach((key) => {
            if (key in this._store) {
                delete this._store[key];
            }
        });
    }

    /**
     * Queries for the message based on the given key.
     *
     * @param key - The id of the message.
     * @returns {*} - The message associated with the id.
     */
    find(key) {
        return this._store[key];
    }
};
