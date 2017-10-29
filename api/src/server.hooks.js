// Application hooks that run for every service

const { disallow } = require('feathers-hooks-common');
const logger = require('./hooks/logger');

module.exports = {
  before: {
    all: [],
    find: [],
    get: disallow(),
    create: disallow(),
    update: disallow(),
    patch: disallow(),
    remove: disallow(),
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
