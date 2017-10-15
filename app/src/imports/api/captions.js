import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Captions = new Mongo.Collection('captions');

if (Meteor.isServer) {
	Captions._ensureIndex({start: -1, channel: 1});

	Meteor.publish('captions', function captionsPublication(channelId) {
		return Captions.find({
			channel: channelId
		}, {
			limit: 4,
			sort: {
				start: -1
			}
		});
	});
}
