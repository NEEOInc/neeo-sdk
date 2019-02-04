import * as BluePromise from 'bluebird';
import { expect } from 'chai';
import * as Directory from '../../../../../src/lib/device/handler/directory';

describe('./lib/device/handler/directory.ts', () => {
  it('should call the directoryGet function of the controller, controller returns promise', () => {
    function handler() {
      return BluePromise.resolve([{}]);
    }

    return Directory.directoryGet(handler, '', {}).then((answer) => {
      expect(answer).to.deep.equal([{}]);
    });
  });

  it('should call the switchGet function of the controller, controller returns value', () => {
    function handler() {
      return [{}];
    }

    return Directory.directoryGet(handler, '', {}).then((answer) => {
      expect(answer).to.deep.equal([{}]);
    });
  });

  it('should call the callAction function of the controller, controller returns promise', () => {
    function handler() {
      return BluePromise.resolve([{}]);
    }

    return Directory.directoryGet(handler, '', {}).then((answer) => {
      expect(answer).to.deep.equal([{}]);
    });
  });

  it('should call the callAction function of the controller, controller returns value', () => {
    function handler() {
      return [{}];
    }

    return Directory.directoryGet(handler, '', {}).then((answer) => {
      expect(answer).to.deep.equal([{}]);
    });
  });
});
