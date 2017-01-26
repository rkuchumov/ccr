import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Channels = new Mongo.Collection('channels');

Channels.schema = new SimpleSchema({
  title: {
    type: String,
    label: "Title",
  },
  location: {
    type: String,
    label: "Location",
    optional: true,
  },
  language: {
    type: String,
    label: "Language",
    optional: true,
  },
  description: {
    type: String,
    label: "Language",
    optional: true,
  },
  website: {
    type: String,
    label: "Official website",
    optional: true,
  },
  tags: {
    type: String,
    // type: [String],
    label: "Tags",
    optional: true,
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

Meteor.methods({
  'channel.upsert'(channel) {
    // TODO: replace with insert and update procedures
    Channels.upsert(channel._id, {
      $set: {
        title:        channel.title,
        location:     channel.location,
        language:     channel.language,
        website:      channel.website,
        tags:         channel.tags,
        description:  channel.description,
        createdAt:    new Date(),
        updatedAt:    new Date(),
      }
    }, (error, result) => {
      console.log("channel.upsert");
      console.log("\tresult:", result);
      console.log("\terror:", error);

      if (error) {
        console.log(Channels.simpleSchema().namedContext().validationErrors());
      }
    });
  },

});
