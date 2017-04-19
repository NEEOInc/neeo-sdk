'use strict';

const os = require('os');
const NIC_LIST = os.networkInterfaces();

module.exports.getAnyIpAddress = function() {
  let ipAddress;
  Object.keys(NIC_LIST).forEach((ifname) => {
    NIC_LIST[ifname].forEach((iface) => {
      if ('IPv4' !== iface.family || iface.internal !== false || ipAddress) {
        return;
      }
      ipAddress = iface.address;
    });
  });
  return ipAddress;

};
