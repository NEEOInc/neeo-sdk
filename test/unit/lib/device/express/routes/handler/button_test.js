'use strict';

const expect = require('chai').expect;
const Button = require('../../../../../../../lib/device/express/routes/handler/button');
const BluePromise = require('bluebird');

describe('./lib/device/express/routes/handler/button.js', function() {

  it('should call the button function of the controller, controller returns promise', function(done) {
    let buttonTriggered = false;
    function handler() {
      buttonTriggered = true;
      return BluePromise.resolve();
    }
    Button.trigger('deviceid', handler)
      .then((answer) => {
        expect(answer).to.deep.equal({ success: true });
        expect(buttonTriggered).to.equal(true);
        done();
      });
  });

  it('should call the button function of the controller, controller returns value', function(done) {
    let buttonTriggered = false;
    function handler() {
      buttonTriggered = true;
    }
    Button.trigger('deviceid', handler)
      .then((answer) => {
        expect(answer).to.deep.equal({ success: true });
        done();
      });
  });

});
