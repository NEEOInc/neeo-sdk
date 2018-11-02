import * as os from 'os';

const NIC_LIST = os.networkInterfaces();

export function getAnyIpAddress() {
  for (const key of Object.keys(NIC_LIST)) {
    for (const { family, internal, address } of NIC_LIST[key]) {
      if (family === 'IPv4' && !internal) {
        return address;
      }
    }
  }
  // Won't hit - likely.
  return '127.0.0.1';
}
