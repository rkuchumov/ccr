import io from 'socket.io-client';
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client';

import mongodb from './mongodb';

const socket = io();
const client = feathers();

client.configure(hooks());
client.configure(socketio(socket));
client.configure(mongodb());

export default client;
