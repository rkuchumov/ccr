const cp = require('child_process');

var log = {};
var config = {};

module.exports = function(config_, log_) {
	config = config_;
	log = log_;

	return {
		spawn: spawn,
	};
}

function spawn(options) {
	console.assert(config.cce.path, 'CCExtractor path is not set');
	console.assert(options.argv.length, 'argv[] is empty');
	console.assert(options.stdout, 'CCExtractor stdout callback is not set');

	this._spawn = () => {
		log.info('Spawning CCExtractor: ' + config.cce.path);
		log.info('    argv: ' + options.argv.join(' '));

		this.handle = cp.spawn(config.cce.path, options.argv);
		log.info('     pid: ' + this.handle.pid);

		this.handle.stdout.on('data', options.stdout);

		this.handle.stderr.on('data', (data) => {
			log.warn('CCExtractor (pid ' + this.handle.pid + ') stderr: ');
			log.warn(data);
		});

		this.handle.on('close', (code) => {
			if (this.killed) {
				return;
			}

			log.error('CCExtractor (pid ' + this.handle.pid + ') exited with code ' + code);

			if (config.restart > 0) {
				log.debug('Restarting (old pid ' + this.handle.pid + ')');
				console.log(config.restart);

				setTimeout(this._spawn, config.restart * 1000);
			} else {
				this.killed = true;
			}
		});
	}

	this.killed = false;

	this._spawn();

	this.kill = (signal) => {
		if (this.killed) {
			return;
		}

		if (!signal) {
			signal = 'SIGKILL'; // brutal
		}

		log.info('Killing (' + signal + ') CCExtractor (pid ' + this.handle.pid + ')');

		this.killed = true;
		this.handle.kill(signal);

		// TODO: should I `delete this.handle;` ?
	}
};

