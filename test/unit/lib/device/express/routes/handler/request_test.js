'use strict';

const expect = require('chai').expect;
const Request = require('../../../../../../../lib/device/express/routes/handler/request');

describe('./lib/device/express/routes/handler/request.js', function() {

  it('should fail to call discover without controller', function() {
    return Request.discover()
      .catch((error) => {
        expect(error.message).to.equal('INVALID_DISCOVER_PARAMETER');
      });
  });

  it('should fail to call discover with invalid controller', function() {
    return Request.discover({ controller: 123 })
      .catch((error) => {
        expect(error.message).to.equal('CONTROLLER_IS_NOT_A_FUNCTION');
      });
  });

  it('should fail to call handleGet without parameter', function() {
    return Request.handleGet()
      .catch((error) => {
        expect(error.message).to.equal('INVALID_GET_PARAMETER');
      });
  });

  it('should fail to call handleGet with invalid componenttype', function() {
    return Request.handleGet({
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
    return Request.handleGet({
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
    return Request.handleSet()
      .catch((error) => {
        expect(error.message).to.equal('INVALID_SET_PARAMETER');
      });
  });

  it('should fail to call handleSet without controller', function() {
    return Request.handleSet({
        handler: {
          componenttype: 'switch'
        },
      })
      .catch((error) => {
        expect(error.message).to.equal('INVALID_SET_PARAMETER');
      });
  });

  it('should fail to call handleSet without controller', function() {
    return Request.handleSet({
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
