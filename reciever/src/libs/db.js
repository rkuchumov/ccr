const util = require('util');

var mongo = require('mongodb').MongoClient;

var log = {};
var config = {};
var handle = null;
var captions = null;

module.exports = function(config_, log_) {
	config = config_;
	log = log_;

	return {
		connect: connect,
		disconnect: disconnect,
		addCaption: addCaption,
	}
}

function connect() {
	return new Promise((resolve, reject) => {
		log.debug('Connecting to ', config.db.endpoint);
		mongo.connect(config.db.endpoint, (err, db) => {
			if (err) {
				handle = null;
				log.error("Can not connect to MongoDB server: ", err);
				setTimeout(connect, config.db.reconnect);
				return;
			}

			log.info("Connected correctly to MongoDB server.");
			handle = db;

			captions = handle.collection('captions');

			captions.ensureIndex({start: -1, channel: 1});

			resolve();
		}); // TODO: handle exception on error
	})
}

function disconnect() {
	log.debug('Closing connection to ', config.db.endpoint);
	if (!handle)
		return;

	handle.close();
	handle = null;
}

function addCaption(cc) {
	if (!handle)
		return;

	log.debug('Inserting ', JSON.stringify(cc));

	captions.updateOne(
		{
			start: cc.start,
			channel: cc.channel,
		},
		cc,
		{
			upsert: true,
			w: 1,
		}
	)
}
