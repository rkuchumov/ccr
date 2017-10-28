const channels = require('./channels/channels.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(channels);
};
