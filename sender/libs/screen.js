var Levenshtein = require('levenshtein');

var log = {};
var config = {};

var screen = [];

module.exports = function(config_, log_) {
	config = config_;
	log = log_;

	return {
		update: update,
	};
}

function update(caption) {
	var duplicate = updateDuplicates(caption);
	if (duplicate) {
		return duplicate;
	}

	var prefix = updatePrefixes(caption);
	if (prefix) {
		return prefix;
	}

	rollup(caption);

	return caption;
}

function updateDuplicates(caption) {
	for (var i in screen) {
		if (!equals(caption, screen[i])) {
			continue;
		}

		updateLine(screen[i], caption);
		return screen[i];
	}

	return null;
}

function equals(first, second) {
	if (first.mode != second.mode) {
		return false;
	}

	return first.text == second.text;
}

function updatePrefixes(caption) {
	for (var i in screen) {
		if (!isFuzzyPrefix(screen[i], caption)) {
			continue;
		}

		updateLine(screen[i], caption);
		return screen[i];
	}

	return null;
}

function isFuzzyPrefix(prefix, line) {
	if (prefix.mode != line.mode) {
		return false;
	}

	if (prefix.text.length > line.text.length) {
		return false;
	}

	var p = line.text.substr(0, prefix.text.length);

	if (p.length <= config.minPrefixDistance) {
		return p == prefix.text;
	}

	var dist = (new Levenshtein(prefix.text, p)).distance;
	return dist < config.minPrefixDistance;
}

function updateLine(line, update) {
	line.duration += update.duration;
	line.text = update.text;
}

function rollup(caption) {
	screen.push(caption);

	if (screen.length > config.maxScreenLines) {
		screen.shift();
	}
}
