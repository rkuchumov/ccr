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
    var collection = db.collection('captions');
    service.Model = collection;

    var latest = collection.find()
      .sort({$natural: -1})
      .limit(1);

    latest.nextObject((err, doc) => {
      if (err)
        throw err;

      var query =  {
        _id: { $gt: doc._id },
      };

      var options = {
        tailable: true,
        awaitdata: true,
        numberOfRetries: -1
      };

      var stream = collection.find(query, options).stream();
      stream.on('data', item => service.emit('created', item));
    });
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
