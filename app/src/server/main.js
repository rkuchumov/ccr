import { Meteor } from 'meteor/meteor';

import '../imports/api/channels.js';
import { Captions } from '../imports/api/captions.js';

Meteor.startup(() => {
  Captions._ensureIndex({start: -1, channel: 1});
  // code to run on server at startup
});
