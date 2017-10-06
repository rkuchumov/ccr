const intel = require('intel');

module.exports = function(config)
{
	intel.setLevel(intel.WARN);

	if (config.log.verbose) {
		intel.setLevel(intel.INFO);
	} else if (config.log.debug) {
		intel.setLevel(intel.ALL);
	}

	if (config.log.quiet) {
		intel.setLevel(intel.CRITICAL);
	}

	if (config.log.path)
		intel.addHandler(new intel.handlers.File({
			file: config.log.path,
			formatter: new intel.Formatter({
				format: '[%(date)s][%(levelname)s][%(name)s] %(message)s',
			})
		}));

	intel.addHandler(new intel.handlers.Console({
		formatter: new intel.Formatter({
			format: '[%(date)s][%(levelname)s] %(message)s',
			colorize: true,
		})
	}));

	this.logger = intel;

	return this.logger;
}

// TODO: print arrays in a single line using util.inspect

// log.error('error message');
// log.critical('critical message');
// log.warn('warn message');
// log.info('info message');
// log.verbose('verbose message');
// log.debug('debug message');
// log.trace('trace message');
