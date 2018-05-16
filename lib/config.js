'use strict';

module.exports = {
  maxListItemsPerPage: 64,
  maxButtonsPerRow: 3,
  maxTilesPerRow: 2,
  devicesDirectory: process.env.NEEO_DEVICES_DIRECTORY || 'devices',
  devicesExcludedDirectories: process.env.NEEO_DEVICES_EXCLUDED_DIRECTORIES || [],
  brainVersionSatisfaction: '>=0.50.0',
};
