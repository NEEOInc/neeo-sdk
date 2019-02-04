import { expect } from 'chai';
import listBuilder from '../../../../../src/lib/device/lists/listBuilder';
import { validate } from '../../../../../src/lib/device/validation/playerWidget';
import { PlayerWidget } from '../../../../../src/lib/models';

describe('./lib/device/validation/playerWidget', () => {
  describe('validate', () => {
    it('should reject for undefined handler', () => {
      expectThrowFor(undefined, /PLAYER_WIDGET_HANDLER_UNDEFINED/);
    });

    it('should reject for missing root directory', () => {
      const handler = {};
      expectThrowFor(handler, /PLAYER_WIDGET_HANDLER_MISSING_ROOT_DIRECTORY/);
    });

    it('should not throw for simple valid handler', () => {
      const handler: PlayerWidget.Controller = {
        rootDirectory: mockDirectoryHandler(),
        volumeController: mockSensorController(),
        coverArtController: mockSensorController(),
        titleController: mockSensorController(),
        descriptionController: mockSensorController(),
        playingController: mockSwitchController(),
        muteController: mockSwitchController(),
        shuffleController: mockSwitchController(),
        repeatController: mockSwitchController(),
      };

      expect(() => validate(handler)).to.not.throw();
    });

    it('should not throw for valid handler with optionals', () => {
      const handler: PlayerWidget.Controller = {
        rootDirectory: mockDirectoryHandler(),
        queueDirectory: mockDirectoryHandler(),
        volumeController: mockSensorController(),
        coverArtController: mockSensorController(),
        titleController: mockSensorController(),
        descriptionController: mockSensorController(),
        playingController: mockSwitchController(),
        muteController: mockSwitchController(),
        shuffleController: mockSwitchController(),
        repeatController: mockSwitchController(),
      };

      expect(() => validate(handler)).to.not.throw();
    });
  });

  function expectThrowFor(handler, expectedError) {
    expect(() => validate(handler as PlayerWidget.Controller))
      .to.throw(expectedError);
  }

  function mockDirectoryHandler() {
    return {
      controller: {
        getter: (deviceId, params) => new listBuilder(),
        action: (deviceId, params) => {},
      },
    };
  }

  function mockSensorController() {
    return { getter: (deviceId) => 0, setter: (deviceId, params) => {} };
  }

  function mockSwitchController() {
    return { getter: (deviceId) => true, setter: (deviceId, params) => {} };
  }
});
