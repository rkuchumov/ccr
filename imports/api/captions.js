import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Captions = new Mongo.Collection('captions');

Captions.schema = new SimpleSchema({
  channel: {
    type: String,
    label: "Channel ID",
  },
  time: {
    type: Number,
    label: "Time",
  },
  duration: {
    type: Number,
    label: "Location",
  },
  mode: {
    type: String,
    label: "Mode",
  },
  text: {
    type: String,
    label: "Text",
  },
});

Captions.attachSchema(Captions.schema);

if (Meteor.isServer) {
  Meteor.publish('captions', function captionsPublication(channelId) {
    return Captions.find({channel: channelId});
  });
}

