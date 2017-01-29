import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Captions = new Mongo.Collection('captions');

Captions.schema = new SimpleSchema({
  channel: {
    type: String,
    label: "Channel ID",
  },
  start: {
    type: Number,
    label: "Start time",
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
  Captions._ensureIndex({start: -1, channel: 1});

  Meteor.publish('captions', function captionsPublication(channelId) {
    return Captions.find({channel: channelId});
  });
}

Meteor.methods({
  'captions.upsert'(caption) {
    Captions.upsert({
      start:    caption.start,
      channel:  caption.channel
    }, {
      $set: {
        duration:  caption.duration,
        mode:      caption.mode,
        text:      caption.text
      }
    }, (error, result) => {
      console.log("captions.upsert");
      console.log("\tresult:", result);
      console.log("\terror:", error);

      if (error) {
        console.log(Channels.simpleSchema().namedContext().validationErrors());
      }
    });
  },

});
