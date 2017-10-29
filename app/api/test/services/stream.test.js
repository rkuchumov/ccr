const assert = require('assert');
const app = require('../../src/app');

describe('\'stream\' service', () => {
  it('registered the service', () => {
    const service = app.service('stream');

    assert.ok(service, 'Registered the service');
  });
});
