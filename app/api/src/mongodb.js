const MongoClient = require('mongodb').MongoClient;

module.exports = function () {
  const app = this;
  const config = app.get('mongodb');
  //console.log('config : '+ config);
  const promise = MongoClient.connect(config);

  app.set('mongoClient', promise);
};
