import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Channels = new Mongo.Collection('channels');

Channels.schema = new SimpleSchema({
  title: {
    type: String,
    label: "Title",
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  }
});

Channels.attachSchema(Channels.schema);

if (Meteor.isServer) {
  Meteor.publish('channels', function channelsPublication() {
    return Channels.find();
  });
}
