import * as BluePromise from 'bluebird';
import { expect } from 'chai';
import Deviceroute, {
  registerHandler,
} from '../../../../../src/lib/expressBrainDriver/routes/deviceRoute';

describe('./lib/expressBrainDriver/routes/deviceroute.ts', () => {
  it('should find adapter in router', () => {
    const adapterid = '123';
    const next = () => {};
    const handlerResult = 'AAA';
    const handler = {
      getDeviceByAdapterId: () => {
        return BluePromise.resolve(handlerResult);
      },
    };
    const req = {};
    // @ts-ignore
    registerHandler(handler);

    // @ts-ignore
    return Deviceroute.params.adapterid[0](req, undefined, next, adapterid).then(() => {
      // @ts-ignore
      expect(req.adapter).to.equal(handlerResult);
    });
  });
});
