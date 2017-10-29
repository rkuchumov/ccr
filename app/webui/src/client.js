
import feathers from 'feathers/client';

import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';
import io from 'socket.io-client';

const client = feathers();

const socket = io();

// TODO: if NODE_ENV != production then ....
// const socket = io("ws://localhost:3031/");

client.configure(hooks());
client.configure(socketio(socket));

export default client;

