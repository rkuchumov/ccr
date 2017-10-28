import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

const Captions = new Mongo.Collection('captions');
const Streaming = new Mongo.Collection('streaming');

export {Captions, Streaming};

if (Meteor.isServer) {
	Meteor.publish('captions', function (channel) {

		var latest = Captions.find({channel: channel}, {
				limit: 4,
				sort: {$natural: -1}
			});


		return latest;
		// console.log(latest);

		// const handle = Captions.find(
		// 	{
		// 		channel: channel,
		// 		_id: { $gt: latest._id },
		// 	}, {
		// 	// sort: {$natural: -1},
		// 	}
		// ).observe({
		// 	added: (cc) => {
		// 		this.added('captions', cc._id, cc);
		// 	},
		// 	removed: (cc) => {
		// 		this.removed('captions', cc._id, cc);
		// 	}
		// });

		// return {};

		// return Captions.find({channel: channel}, {
		// 	sort: {$natural: -1},
		// 	limit: 1
		// });
	});
}
