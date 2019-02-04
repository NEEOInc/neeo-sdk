import { PlayerWidget } from '../../models';

const requiredControllers = [
 'volumeController',
 'coverArtController',
 'descriptionController',
 'titleController',
 'playingController',
 'muteController',
 'shuffleController',
 'repeatController',
];

export function validate(handler: PlayerWidget.Controller) {
  if (!handler) {
    throw new Error('PLAYER_WIDGET_HANDLER_UNDEFINED');
  }

  if (!handler.rootDirectory) {
    throw new Error('PLAYER_WIDGET_HANDLER_MISSING_ROOT_DIRECTORY');
  }

  const missingControllers = requiredControllers.filter((controller) => {
    return !handler[controller];
  });

  if (missingControllers.length > 0) {
    const missingList = missingControllers.join(', ');
    throw new Error(`PLAYER_WIDGET_MISSING_CONTROLLERS: ${missingList}`);
  }
}
