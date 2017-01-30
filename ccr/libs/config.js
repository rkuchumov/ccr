const args = require('commander');

module.exports = function() {

	args.version('ccr 1.0.0');

	// CCExtractor
	args.option('-e, --ccextractor [path]', 'CCExtractor execution command', 'ccextractor');
	args.option('-u, --udp [address]', 'Video stream input UDP address.');
	args.option('-s, --stream [path]', 'Video input stream file.');
	args.option('--no-bin', 'If specified BIN data wont be extracted.');
	args.option('--tmpdir [path]', 'Directory for temporary files.', '/tmp');
	args.option('--autorestart [seconds]', 'Restart CCExtractor and server connection after specified ' +
		'number of seconds (0 means no restart)', '2');

	// TODO: implement
	// args.option('--cce-txt-args [args]', 'CCExtractor(BIN) additional arguments');
	// args.option('--cce-bin-args [args]', 'CCExtractor(BIN) additional arguments');

	// Connection
	args.option('-D, --destination [address]', 'Destination address', 'localhost:3000');
	args.option('-U, --login [user]', 'User login.');
	args.option('-P, --password [password]', 'User password.');
	args.option('-C, --channel [id]', 'Channel ID.');
	args.option('--bin-size', 'Number of bytes of BIN data to be send in one request.');
	args.option('--txt-max-size', 'Max number of bytes to be send in a single TXT request.');

	// Logs
	args.option('-v, --verbose', 'Produce verbose output.');
	args.option('--silent, --quiet', 'Don\'t produce any output');
	args.option('--debug', 'Produce debug output.');
	args.option('--logfile [path]', 'Log file path');

	args.option('-a, --all', 'Print runtime configuration and exit.');

	args.parse(process.argv);

	var config = {};

	config.cce = {};
	config.cce.path    = args.ccextractor;
	config.cce.udp     = args.udp;
	config.cce.stream  = args.stream;
	config.cce.bin     = args.bin;
	config.cce.binArgs = args.cceBinArgs;
	config.cce.txtArgs = args.cceTxtArgs;
	config.cce.tmpDir  = args.tmpdir;

	config.minPrefixDistance  = 3;
	config.maxScreenLines = 4;
	config.restart = args.autorestart;

	config.conn = {};
	config.conn.destination = 'ws://' + args.destination + '/websocket';
	config.conn.user        = args.user;
	config.conn.password    = args.password;
	config.conn.channel     = args.channel;
	config.conn.binSize     = args.binSize;
	config.conn.txtMaxSize  = args.txtMaxSize;

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

