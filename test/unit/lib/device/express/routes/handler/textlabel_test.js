'use strict';

const expect = require('chai').expect;
const Textlabel = require('../../../../../../../lib/device/express/routes/handler/textlabel');
const BluePromise = require('bluebird');

describe('./lib/device/express/routes/handler/textlabel.js', function() {

  it('should call the getText function of the controller, controller returns promise', function(done) {
    const value = 'bar';
    let getTextTriggered = false;
    function handler() {
      getTextTriggered = true;
      return BluePromise.resolve(value);
    }
    Textlabel.getText(handler)
      .then((answer) => {
        expect(answer).to.deep.equal({ value });
        expect(getTextTriggered).to.equal(true);
        done();
      });
  });

  it('should call the getText function of the controller, controller returns value', function(done) {
    const value = 'foo';
    let getTextTriggered = false;
    function handler() {
      getTextTriggered = true;
      return value;
    }
    Textlabel.getText(handler)
      .then((answer) => {
        expect(answer).to.deep.equal({ value });
        expect(getTextTriggered).to.equal(true);
        done();
      });
  });


});
