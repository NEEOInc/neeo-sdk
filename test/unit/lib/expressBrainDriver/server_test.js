'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const sinon = require('sinon');
const http = require('http');

const routeDevice = require('../../../../lib/expressBrainDriver/routes/deviceroute');
const routeDatabase = require('../../../../lib/expressBrainDriver/routes/db');

describe('./lib/expressBrainDriver/server.js', function() {
  const sandbox = sinon.sandbox.create();
  let ExpressServer, mockServer;

  before(function() {
    sinon.stub(http,'createServer');

    mockServer= {
      listen: () => {},
      close: () => {}
    };

    http.createServer.returns(mockServer);

    ExpressServer = require('../../../../lib/expressBrainDriver/server');
  });

  after(function() {
    http.createServer.restore();
  });

  beforeEach(function() {
    sandbox.stub(mockServer, 'listen').callsArg(2);
    sandbox.stub(mockServer, 'close').callsArg(0);
    sandbox.stub(routeDevice, 'registerHandler');
    sandbox.stub(routeDatabase, 'registerHandler');
  });

  afterEach(function() {
    ExpressServer.stopExpress();
    sandbox.restore();
  });

  describe('start', function() {
    it('should start lisening on the server', function() {
      // GIVEN
      const conf = {
        port: 65500
      };
      const handler = {};

      // WHEN
      return ExpressServer.startExpress(conf,handler)
        .then(()=> {
          expect(mockServer.listen).to.have.been.calledOnce;
        });
    });

    it('should pass requestHandler to routeDevice', function() {
      // GIVEN
      const conf = {
        port: 65500
      };
      const handler = {};

      // WHEN
      return ExpressServer.startExpress(conf,handler)
        .then(()=> {
          expect(routeDevice.registerHandler).to.have.been.calledOnce;
          expect(routeDevice.registerHandler).to.have.been.calledWith(handler);
        });
    });

    it('should pass requestHandler to routeDatabase', function() {
      // GIVEN
      const conf = {
        port: 65500
      };
      const handler = {};

      // WHEN
      return ExpressServer.startExpress(conf,handler)
        .then(()=> {
          expect(routeDatabase.registerHandler).to.have.been.calledOnce;
          expect(routeDatabase.registerHandler).to.have.been.calledWith(handler);
        });
    });
  });

});
