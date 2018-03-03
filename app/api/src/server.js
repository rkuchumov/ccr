const path = require('path');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./server.hooks');

const mongodb = require('./mongodb');

const server = feathers();

// Load server configuration
server.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
server.use(cors());
server.use(helmet());
server.use(compress());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

if (server.get('public') !== ''){
  console.log('y');
  server.use('/', feathers.static(server.get('public')));
}

// Set up Plugins and providers
server.configure(hooks());
server.configure(mongodb);
server.configure(rest());
server.configure(socketio());

// Configure other middleware (see `middleware/index.js`)
server.configure(middleware);
// Set up our services (see `services/index.js`)
server.configure(services);
// Configure a middleware for 404s and the error handler
server.use(notFound());
server.use(handler());

server.hooks(appHooks);

module.exports = server;
