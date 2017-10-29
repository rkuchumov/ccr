// Initializes the `captions` service on path `/captions`
const createService = require('feathers-mongodb');
const hooks = require('./captions.hooks');
const filters = require('./captions.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/captions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('captions');

  mongoClient.then(db => {
    service.Model = db.collection('captions');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
