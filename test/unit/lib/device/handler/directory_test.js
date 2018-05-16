'use strict';

const expect = require('chai').expect;
const Directory = require('../../../../../lib/device/handler/directory');
const BluePromise = require('bluebird');

describe('./lib/device/handler/directory.js', function() {

  it('should call the directoryGet function of the controller, controller returns promise', function() {
    function handler() {
      return BluePromise.resolve([{}]);
    }

    return Directory.directoryGet(handler)
      .then((answer) => {
        expect(answer).to.deep.equal([{}]);
      });
  });

  it('should call the switchGet function of the controller, controller returns value', function() {
    function handler() {
      return [{}];
    }

    return Directory.directoryGet(handler)
      .then((answer) => {
        expect(answer).to.deep.equal([{}]);
      });
  });

  it('should call the callAction function of the controller, controller returns promise', function() {
    function handler() {
      return BluePromise.resolve([{}]);
    }

    return Directory.callAction(handler)
      .then((answer) => {
        expect(answer).to.deep.equal([{}]);
      });
  });

  it('should call the callAction function of the controller, controller returns value', function() {
    function handler() {
      return [{}];
    }

    return Directory.callAction(handler)
      .then((answer) => {
        expect(answer).to.deep.equal([{}]);
      });
  });

});
