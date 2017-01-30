const WebSocket = require('ws');
const DDP = require('ddp.js').default;
const util = require('util');

var log = {};
var config = {};

var ddp = {};

module.exports = function(config_, log_) {
	config = config_;
	log = log_;

	return {
		connect: connect,
		disconnect: disconnect,
		sendCaptions:  sendCaptions,
	}
}

function connect() {
	return new Promise((resolve, reject) => {
		log.info('Connecting to ' + config.conn.destination);

		ddp = new DDP({
			endpoint: config.conn.destination,
			SocketConstructor: WebSocket
		});

		ddp.on("connected", () => {
			log.info('Connected');
			// TODO: handle error
			resolve();
		});

		ddp.on("result", message => {
			log.debug('recieved: ', message)
		});
	});
}

function disconnect() {
	ddp.disconnect();
}

function sendCaptions(captions) {

	if (!(captions instanceof Array)) {
		captions = [captions];
	}

	for (var i in captions) {
		captions[i].channel = config.conn.channel;
	}

	log.debug('sending ', util.inspect(captions));

	var id = ddp.method("captions.upsert", captions);
	log.debug('call id: ', id)
}

