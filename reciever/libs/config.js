const args = require('commander');

module.exports = function() {
	// Connection
	args.option('-S, --source [address]', 'Sender source address', 'tcp://127.0.0.1:5000');

	// Database
	args.option('-D, --database [url]', 'Database endpoint adress', 'mongodb://127.0.0.1:3001/meteor');
	args.option('--reconnect [ms]', 'Delay (ms) between DB reconnect', '1000');

	// Logs
	args.option('--silent, --quiet', 'Don not produce any output');
	args.option('-v, --verbose', 'Produce verbose output.');
	args.option('--debug', 'Produce debug output.');
	args.option('--logfile [path]', 'Log file path');

	args.option('-a, --all', 'Print runtime configuration and exit.');

	args.parse(process.argv);

	var config = {};

	config.conn = {};
	config.conn.source = args.source;
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

