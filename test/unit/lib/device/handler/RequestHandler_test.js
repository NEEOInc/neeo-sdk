'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const sinon = require('sinon');
const RequestHandler = require('../../../../../lib/device/handler/RequestHandler');

describe('./lib/device/handler/index.js', function() {
  let db;
  let requestHandler;

  beforeEach(function() {
    db = {
      search: sinon.stub(),
      getDevice: sinon.stub()
    };
    requestHandler = new RequestHandler(db);
  });

  it('should handle searchDevice', function() {
    // GIVEN
    const query = 'NEEO Brain';

    // WHEN
    requestHandler.searchDevice(query);

    // THEN
    expect(db.search).to.have.been.calledWith(query);
  });

  it('should handle getDevice', function() {
    // GIVEN
    const id = 'NEEO Brain';

    // WHEN
    requestHandler.getDevice(id);

    // THEN
    expect(db.getDevice).to.have.been.calledWith(id);
  });

  it('should fail to call discover without controller', function() {
    return requestHandler.discover()
      .catch((error) => {
        expect(error.message).to.equal('INVALID_DISCOVER_PARAMETER');
      });
  });

  it('should fail to call discover with invalid controller', function() {
    return requestHandler.discover({ controller: 123 })
      .catch((error) => {
        expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
      });
  });

  it('should fail to call handleGet without parameter', function() {
    return requestHandler.handleGet()
      .catch((error) => {
        expect(error.message).to.equal('INVALID_GET_PARAMETER');
      });
  });

  it('should fail to call handleGet with invalid componenttype', function() {
    return requestHandler.handleGet({
        handler: {
          componenttype: 'foo',
          controller: {}
        },
      })
      .catch((error) => {
        expect(error.message).to.equal('INVALID_GET_COMPONENT');
      });
  });

  it('should fail to call handleGet without controller', function() {
    return requestHandler.handleGet({
        handler: {
          componenttype: 'switch',
          controller: {}
        },
      })
      .catch((error) => {
        expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
      });
  });

  it('should fail to call handleSet without parameter', function() {
    return requestHandler.handleSet()
      .catch((error) => {
        expect(error.message).to.equal('INVALID_SET_PARAMETER');
      });
  });

  it('should fail to call handleSet without controller', function() {
    return requestHandler.handleSet({
        handler: {
          componenttype: 'switch'
        },
      })
      .catch((error) => {
        expect(error.message).to.equal('INVALID_SET_PARAMETER');
      });
  });

  it('should fail to call handleSet without controller', function() {
    return requestHandler.handleSet({
        handler: {
          componenttype: 'switch',
          controller: {}
        },
      })
      .catch((error) => {
        expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
      });
  });

});
