"use strict";

const config = {};

config.PORT = 8086;
config.JOB_LIFETIME_SECONDS = 500;
config.MAX_MESSAGE_FETCH = 5;
config.DATABASE_SIMULATED_DELAY = 50;


//Routes
config.SEND_URL = '/send';
config.FETCH_URL = '/fetch';
config.CONFIRM_URL = '/confirm';

module.exports = config;