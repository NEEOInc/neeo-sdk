'use strict';

module.exports = {
  maxListItemsPerPage: 64,
  maxButtonsPerRow: 3,
  maxTilesPerRow: 2,
  sensorUpdateKey: 'DEVICE_SENSOR_UPDATE',
  devicesDirectory: process.env.NEEO_DEVICES_DIRECTORY || 'devices',
  devicesExcludedDirectories: process.env.NEEO_DEVICES_EXCLUDED_DIRECTORIES || [],
  brainVersionSatisfaction: '>=0.50.0',
  brainLookupDurationMs: process.env.NEEO_BRAIN_LOOKUP_TIMEOUT_MS || 5000,
};
