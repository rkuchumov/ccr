db.createCollection('channels');

db.channels.updateOne(
  { _id: 'test1' }, {
    $set: {
      title: 'Test Channel #1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }, { upsert: true}
)

db.channels.updateOne(
  { _id: 'test2' }, {
    $set: {
      title: 'Test Channel #2',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }, { upsert: true}
)

db.createCollection('captions');
db.captions.ensureIndex({channel: 1, start: -1});

db.createCollection('stream', {
  capped: true,
  size: 500000,
  max: 2000
});
