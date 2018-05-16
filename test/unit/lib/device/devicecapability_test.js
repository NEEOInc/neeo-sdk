'use strict';

const expect = require('chai').expect;
const DeviceCapability = require('../../../../lib/device/devicecapability');

describe('./lib/device/devicecapability.js', function() {

  it('should fail to build devicecapability, no parameters', function() {
    expect(function() {
      DeviceCapability.build();
    }).to.throw(/INVALID_PARAMETERS/);
  });

  it('should fail to build devicecapability, invalid parameters', function() {
    expect(function() {
      DeviceCapability.build({}, {});
    }).to.throw(/INVALID_PARAMETERS/);
  });

  it('should build empty devicecapability', function() {
    const data = {
      buttons: [],
      sliders: [],
      textLabels: [],
      imageUrls: [],
      switches: [],
      sensors: [],
      directories: [],
      discovery: [],
      registration: [],
    };
    const result = DeviceCapability.build(data, 'unittest');
    expect(result.capabilities).to.deep.equal([]);
    expect(result.handlers.size).to.equal(0);
  });

  it('should build devicecapability with one button, make sure devicehandler can be accessed using the encoded name', function() {
    const data = {
      buttons: [{
        param: { name: 'power on', label: 'Power On' },
        controller: function(){} }],
      sliders: [],
      textLabels: [],
      imageUrls: [],
      switches: [],
      sensors: [],
      discovery: [],
      registration: [],
      directories: [],
      deviceidentifier: 'foobar'
    };
    const result = DeviceCapability.build(data, 'unittest');
    expect(result.capabilities).to.deep.equal([{ type:'button',name:'power%20on',label:'Power On',path:'/device/foobar/power%20on' }]);
    expect(result.handlers.size).to.equal(1);
    expect(typeof result.handlers.get('power on')).to.equal('object');
    expect(typeof result.handlers.get('power%20on')).to.equal('undefined');
  });

});
