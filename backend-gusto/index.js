const express = require("express");
const app = express();
const winston = require('winston')
const auth = require('./routes/auth');
const config = require('config');

require('./setup/routes') (app);
require('./setup/db')();

require('./setup/config')();

const port = process.env.PORT || 1789;
const server = app.listen(port, () => {winston.info(`listenning on port ${port} ...`);})

module.exports = server;