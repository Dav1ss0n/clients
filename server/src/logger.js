const winston = require('winston');
const { transports } = winston;
require("winston-mongodb");
const mongoose = require("mongoose");

const { combine, timestamp, json, metadata } = winston.format;


const errorFilter = winston.format((info, opts) => {
  return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
  return info.level === 'info' ? info : false;
});


const logger = winston.createLogger({
  level: 'info',

  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss Z',
    }),
    json(),
    metadata()
  ),

  transports: [
    new transports.Console(),
    new transports.MongoDB({
      db: mongoose.connection.useDb("clients"),
      options: { useUnifiedTopology: true },
      collection: "combinedLog"
    }),
    new transports.MongoDB({
      level: "error",
      db: mongoose.connection.useDb("clients"),
      options: { useUnifiedTopology: true },
      collection: "errorLog",
      format: combine(errorFilter(), timestamp(), json()),
    }),
    new transports.MongoDB({
      level: "info",
      db: mongoose.connection.useDb("clients"),
      options: { useUnifiedTopology: true },
      collection: "infoLog",
      format: combine(infoFilter(), timestamp(), json()),
    }),
  ],
});

module.exports = logger;
