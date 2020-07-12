"use strict";

const config = {};

config.port = 8086;
config.jobLifetimeSeconds = 500;
config.maxMessageFetch = 5;
config.DatabaseSimulatedDelay = 50;


//Routes
config.sendURL = '/send';
config.fetchURL = '/fetch';
config.confirmURL = '/confirm';

module.exports = config;