'use strict';

const expect = require('chai').expect;
const Deviceroute = require('../../../../../lib/expressBrainDriver/routes/deviceroute');

describe('./lib/expressBrainDriver/routes/deviceroute.js', function() {

  it('should find adapter in router', function() {
    const adapterid = '123';
    const next = function() {};
    const handlerResult = 'AAA';
    const handler = {
      getDeviceByAdapterId: () => {
        return Promise.resolve(handlerResult);
      }
    };
    const req = {};
    Deviceroute.registerHandler(handler);
    return Deviceroute.params.adapterid[0](req, undefined, next, adapterid)
      .then(() => {
        expect(req.adapter).to.equal(handlerResult);
      });
  });

});
