const channels = require('./channels/channels.service.js');
const captions = require('./captions/captions.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(channels);
  app.configure(captions);
};
