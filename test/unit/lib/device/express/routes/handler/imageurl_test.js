'use strict';

const expect = require('chai').expect;
const ImageUrl = require('../../../../../../../lib/device/express/routes/handler/imageurl');
const BluePromise = require('bluebird');

describe('./lib/device/express/routes/handler/imageurl.js', function() {
  it('should call the getImageUri function of the controller, controller returns promise', function() {
    const value = 'bar';
    let getImageUriTriggered = false;
    function handler() {
      getImageUriTriggered = true;
      return BluePromise.resolve(value);
    }
    return ImageUrl.getImageUri(handler)
      .then((answer) => {
        expect(answer).to.deep.equal({ value });
        expect(getImageUriTriggered).to.equal(true);
      });
  });

  it('should call the getImageUri function of the controller, controller returns value', function() {
    const value = 'foo';
    let getImageUriTriggered = false;
    function handler() {
      getImageUriTriggered = true;
      return value;
    }
    return ImageUrl.getImageUri(handler)
      .then((answer) => {
        expect(answer).to.deep.equal({ value });
        expect(getImageUriTriggered).to.deep.equal(true);
      });
  });
});
