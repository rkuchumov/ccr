const cp = require('child_process');
const bsplit = require('buffer-split');

var log = {};
var config = {};
var cce = {};

var handles = [];

module.exports = function(config_, log_) {
	cce = require('./cce.js')(config_, log_)
	config = config_;
	log = log_;

	return {
		initialize: initialize,
		terminate: terminate
	};
}

function initialize(onTxt) {
	console.assert(onTxt, 'Caption line cb is not set');

	if (config.cce.bin) {
		log.info('BIN streaming is not implemented yet, falling back to --no-bin');
	}

	var handle = new cce.spawn({
		argv: getTxtOnlyArgs(),
		stdout: (data) => {
			parseTxtOutput(data, onTxt);
		}
	});

	handles.push(handle);
};

function terminate() {
	handles.forEach((handle) => {
		handle.kill();
	});
}

function getTxtOnlyArgs() {
	var argv = [
		'-stdout',
		'-out=ttxt',
		'-quiet',
		'--forceflush',
		'-sects', // Time as ss,ms
		'-dru', // Direct Roll-Up
		'-nobom',
		'-lf', // Linefeed instead of CRLF
		'-unixts', '0' // Display current time, doesn't work :)
	];

	if (config.cce.udp)
		argv.push('-udp', config.cce.udp);
	else if (config.cce.stream)
		argv.push('--stream', config.cce.stream);
	else
		console.assert(false, 'CCExtractor input source is not set');

	return argv;
}

function parseTxtOutput(buffer, callback) {
	console.assert(callback, 'Callback is not set');

	var delim = new Buffer('\n');
	var splitted = bsplit(buffer, delim, true);

	if (!this.line)
		this.line = "";

	for (var i = 0, len = splitted.length; i < len; i++) {
		var chunk = splitted[i].toString();

		if (!chunk)
			continue;

		this.line += chunk;

		if (chunk[chunk.length - 1] != '\n')
			continue;

		this.line = this.line.slice(0, -1);

		parseTxtLine(this.line, callback);

		this.line = "";
	}
}

function parseTxtTime(str) {
	var splitted = str.split(',');
	if (splitted.length != 2) {
		log.warn('Can\'t parse CC time string: ' + str);
		return null;
	}

	var ss = parseInt(splitted[0]);
	var ms = parseInt(splitted[1]);

	return 1000 * ss + ms;
}

function parseTxtLine(line, callback) {
	console.assert(typeof(line) == 'string', 'String is expected');
	console.assert(callback, 'Callback is not set');

	var splitted = line.split('|');

	if (splitted.length < 4) {
		log.warn('Can\'t split CC line: ' + line);
		return;
	}

	var start = parseTxtTime(splitted[0]);
	var stop = parseTxtTime(splitted[1]);
	var duration = stop - start;

	if (duration < 0) {
		log.warn('Incorrect time: (' + start + '; ' + stop + ') in ' + line);
		return;
	}

	var text = ""; // Merging everything after third |
	for (var i = 3, len = splitted.length; i < len; i++)
		text += splitted[i];

	var caption = {
		duration:  duration,
		mode:      splitted[2],
		text:      text
	}

	callback(caption);
}

