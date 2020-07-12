"use strict";

const config = {};

config.HOST = "localhost";
config.PORT = 8086;
config.FETCH_COUNT = 5;

//Routes
config.SEND_URL = '/send';
config.FETCH_URL = '/fetch';
config.CONFIRM_URL = '/confirm';

module.exports = config;