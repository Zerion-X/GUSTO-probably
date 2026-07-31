const winston = require('winston');
require('winston-mongodb');

module.exports = function() {

  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  
  winston.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));

  winston.add(new winston.transports.MongoDB({
    db: 'mongodb://localhost/Videly',
    level: 'info',
  }));

  winston.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
    new winston.transports.Console({ format: winston.format.simple(), colorize: true })
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
};
