// Initializes the `channels` service on path `/channels`
const createService = require('feathers-mongodb');
const hooks = require('./channels.hooks');
const filters = require('./channels.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/channels', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('channels');

  mongoClient.then(db => {
    service.Model = db.collection('channels');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
