const express = require("express");
const app = express();
const winston = require('winston')
const auth = require('./routes/auth');
const config = require('config');

require('./setup/routes') (app);
require('./setup/db')();

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR:jwtPrivateconfig is not defined');
    process.exit(1);
}

const port = process.env.Port || 1789;
const server = app.listen(port, () => {winston.info(`listenning on port ${port} ...`);})

module.exports = server;