const express = require("express");
const app = express();
const auth = require('./routes/auth');
const config = require('config');
const winston = require('winston');

require('./setup/logger')();
require('./setup/routes') (app);
require('./setup/db')();

try{
    require('./setup/config')();
}
catch (ex) {
    winston.error(ex.message, ex);
    process.exit(1);
}

const port = process.env.PORT || 1789;
const server = app.listen(port, () => {winston.info(`listenning on port ${port} ...`);})

module.exports = server;