import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Channels = new Mongo.Collection('channels');

if (Meteor.isServer) {
	Meteor.publish('channels', function channelsPublication() {
		return Channels.find();
	});
}
