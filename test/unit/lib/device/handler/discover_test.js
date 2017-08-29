'use strict';

const expect = require('chai').expect;
const Discover = require('../../../../../lib/device/handler/discover');
const BluePromise = require('bluebird');

describe('./lib/device/handler/discover.js', function() {

  it('should call the run function of the controller, controller returns array wrapped in a promise', function(done) {
    const value = [{ id: 1, name: 'first' }, { id: 2, name: 'second' }, { id: 3, name: 'third' }];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return BluePromise.resolve(value);
    }
    Discover.run(handler)
      .then((answer) => {
        expect(answer).to.deep.equal(value);
        expect(handlerTriggered).to.equal(true);
        done();
      });
  });

  it('should call the run function of the controller, controller returns array', function(done) {
    const value = [{ id: 1, name: 'first' }, { id: 2, name: 'second' }, { id: 3, name: 'third' }];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return value;
    }
    Discover.run(handler)
      .then((answer) => {
        expect(answer).to.deep.equal(value);
        expect(handlerTriggered).to.equal(true);
        done();
      });
  });

  it('should call the run function of the controller, controller returns invalid data wrapped in a promise', function(done) {
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return BluePromise.resolve();
    }
    Discover.run(handler)
      .catch((error) => {
        expect(error.message).to.equal('INVALID_DISCOVERY_ANSWER');
        expect(handlerTriggered).to.equal(true);
        done();
      });
  });

  it('should call the run function of the controller, controller returns array invalid item data', function(done) {
    const value = [1, 'foo', true, [], null, undefined];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return value;
    }
    Discover.run(handler)
      .catch((error) => {
        expect(error.message).to.equal('INVALID_DISCOVERY_ITEM_DATA');
        expect(handlerTriggered).to.equal(true);
        done();
      });
  });

  it('should call the run function of the controller, controller returns items missing "id" property', function(done) {
    const value = [{ name: 'first' }, { name: 'second' }, { name: 'third' }];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return value;
    }
    Discover.run(handler)
      .catch((error) => {
        expect(error.message).to.equal('INVALID_DISCOVERY_ITEM_DATA');
        expect(handlerTriggered).to.equal(true);
        done();
      });
  });

  it('should call the run function of the controller, controller returns  items missing "name" property', function(done) {
    const value = [{ id: 1 }, { id: 1 }, { id: 3 }];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return value;
    }
    Discover.run(handler)
      .catch((error) => {
        expect(error.message).to.equal('INVALID_DISCOVERY_ITEM_DATA');
        expect(handlerTriggered).to.equal(true);
        done();
      });
  });

  it('should call the run function of the controller, controller returns array with a duplicate device id', function(done) {
    const value = [{ id: 1, name: 'first' }, { id: 1, name: 'second' }, { id: 3, name: 'third' }];
    let handlerTriggered = false;
    function handler() {
      handlerTriggered = true;
      return value;
    }
    Discover.run(handler)
      .catch((error) => {
        expect(error.message).to.equal('INVALID_DISCOVERY_DUPLICATE_DEVICE_IDS');
        expect(handlerTriggered).to.equal(true);
        done();
      });
  });

});
