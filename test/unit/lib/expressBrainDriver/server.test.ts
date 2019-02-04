import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;
import * as http from 'http';
import * as sinon from 'sinon';

import * as routeDatabase from '../../../../src/lib/expressBrainDriver/routes/database';
import * as routeDevice from '../../../../src/lib/expressBrainDriver/routes/deviceRoute';

describe('./lib/expressBrainDriver/server.ts', () => {
  const sandbox = sinon.createSandbox();
  let ExpressServer;
  let mockServer;
  let httpStub;

  before(() => {
    httpStub = sandbox.stub(http);

    mockServer = {
      listen: () => {},
      close: () => {},
    };

    httpStub.createServer.returns(mockServer);

    ExpressServer = require('../../../../src/lib/expressBrainDriver/server');
  });

  after(() => {
    // httpStub.createServer.restore();
    sandbox.restore();
  });

  beforeEach(() => {
    sandbox.stub(mockServer, 'listen').callsArg(2);
    sandbox.stub(mockServer, 'close').callsArg(0);
    sandbox.stub(routeDevice, 'registerHandler');
    sandbox.stub(routeDatabase, 'registerHandler');
  });

  afterEach(() => {
    ExpressServer.stopExpress();
    sandbox.restore();
  });

  describe('start', () => {
    it('should start lisening on the server', () => {
      // GIVEN
      const conf = {
        port: 65500,
      };
      const handler = {};

      // WHEN
      return ExpressServer.startExpress(conf, handler).then(() => {
        expect(mockServer.listen).to.have.been.calledOnce;
      });
    });

    it('should pass requestHandler to routeDevice', () => {
      // GIVEN
      const conf = {
        port: 65500,
      };
      const handler = {};

      // WHEN
      return ExpressServer.startExpress(conf, handler).then(() => {
        expect(routeDevice.registerHandler).to.have.been.calledOnce;
        expect(routeDevice.registerHandler).to.have.been.calledWith(handler);
      });
    });

    it('should pass requestHandler to routeDatabase', () => {
      // GIVEN
      const conf = {
        port: 65500,
      };
      const handler = {};

      // WHEN
      return ExpressServer.startExpress(conf, handler).then(() => {
        expect(routeDatabase.registerHandler).to.have.been.calledOnce;
        expect(routeDatabase.registerHandler).to.have.been.calledWith(handler);
      });
    });
  });
});
