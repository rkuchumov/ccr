const args = require('commander');

module.exports = function() {
	var defaults = {
		source: process.env.CCR_SOURCE || 'tcp://127.0.0.1:5000',
		database: process.env.CCR_MONGO_URL || 'mongodb://127.0.0.1:27017/ccr',
		verbose: process.env.CCR_VERBOSE || undefined,
		debug: process.env.CCR_DEBUG || undefined,
		logfile: process.env.CCR_LOGFILE || __dirname + '/../ccr-reciever.log',
	}

	// Connection
	args.option('-S, --source [address]', 'Sender source address', defaults.source);

	// Database
	args.option('-D, --database [url]', 'Database endpoint adress', defaults.database);
	args.option('--reconnect [ms]', 'Delay (ms) between DB reconnect', '1000');

	// Logs
	args.option('--silent, --quiet', 'Don not produce any output');
	args.option('-v, --verbose', 'Produce verbose output.', defaults.verbose);
	args.option('--debug', 'Produce debug output.', defaults.debug);
	args.option('--logfile [path]', 'Log file path', defaults.logfile);

	args.option('-a, --all', 'Print runtime configuration and exit.');

	args.parse(process.argv);

	var config = {};

	config.conn = {};
	config.conn.source = args.source
	config.conn.monitoring = 500;

	config.db = {};
	config.db.endpoint  = args.database;
	config.db.reconnect = parseInt(args.reconnect);

	config.log = {};
	config.log.verbose  = args.verbose;
	config.log.quiet    = args.quiet;
	config.log.debug    = args.debug;
	config.log.path     = args.logfile;

	if (args.all) {
		console.log("Program runtime configuration:\n");
		console.log(config);
		process.exit();
	}

	return config;
}

