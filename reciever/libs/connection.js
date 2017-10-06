const util = require('util');
var socket = require('zeromq').socket('pull');

var log = {};
var config = {};

module.exports = function(config_, log_) {
	config = config_;
	log = log_;

	return {
		connect: connect,
	}
}

function bindMonitoringEvents(socket) {
	socket.on('connect', (fd, endpoint) => {
		log.debug(endpoint + ': ' + 'connect_delay');
	});

	socket.on('connect_delay', (fd, endpoint) => {
		log.debug(endpoint + ': ' + 'connect_delay');
	});

	socket.on('connect_retry', (fd, endpoint) => {
		log.debug(endpoint + ': ' + 'connect_retry');
	});

	socket.on('listen', (fd, endpoint) => {
		log.debug(endpoint + ': ' + 'listen');
	});

	socket.on('bind_error', (fd, endpoint) => {
		log.debug(endpoint + ': ' + 'bind_error');
	});

	socket.on('accept', (fd, endpoint) => {
		log.debug(endpoint + ': ' + 'accept');
	});

	socket.on('accept_error', (fd, endpoint) => {
		log.debug(endpoint + ': ' + 'accept_error');
	});

	socket.on('close', (fd, endpoint) => {
		log.debug(endpoint + ': ' + 'close');
	});

	socket.on('close_error', (fd, endpoint) => {
		log.debug(endpoint + ': ' + 'close_error');
	});

	socket.on('disconnect', (fd, endpoint) => {
		log.debug(endpoint + ': ' + 'disconnect');
	});
}

function connect(onCaptions) {
	return new Promise((resolve, reject) => {
		if (config.log.debug) {
			socket.monitor(config.conn.monitoring, 0);
			bindMonitoringEvents(socket);
		}

		socket.bindSync(config.conn.source);

		log.info('Listening ' + config.conn.source);

		socket.on("message", ((raw) => {
			log.debug('Recieved: ', raw.toString());

			var data = JSON.parse(raw.toString());
			onCaptions(data);
		}).bind(this));

	});
}
