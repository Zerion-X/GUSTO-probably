const express = require("express");
const app = express();
const winston = require('winston')

require('./setup/routes') (app);
require('./setup/db')();

const port = process.env.Port || 1789;
const server = app.listen(port, () => {winston.info(`listenning on port ${port} ...`);})

module.exports = server;