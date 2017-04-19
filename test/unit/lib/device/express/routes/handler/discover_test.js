'use strict';

const expect = require('chai').expect;
const Discover = require('../../../../../../../lib/device/express/routes/handler/discover');
const BluePromise = require('bluebird');

describe('./lib/device/express/routes/handler/discover.js', function() {

  it('should call the run function of the controller, controller returns array wrapped in a promise', function(done) {
    const value = [1,2,3];
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
    const value = [1,2,3];
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

});
