/* eslint-disable no-console */
const logger = require('winston');
const server = require('./server');
const port = server.get('port');
console.log("port :"+port);
const handle = server.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

handle.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', server.get('host'), port)
);
