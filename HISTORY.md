## 0.48.13 (12/21/2017)
- add default timeout to network requests
- add support for alwaysOn devices
- fixed device type ACCESSOIRE renamed to ACCESSORY
- fixed missing/unclear use how define the listening ip of the adapter, thanks @splattner
- fixed more typos in docs

## 0.47.8 (11/1/2017)
- add standalone sensor component (.addSensor)
- add deviceState service, helps tracking and caching devices
- add support to define device timing (power on, source switch and power off)
- add support for optional initialise function of your controller
- add support for device power state, send notification to NEEO Brain when device change its power state
- update discovery docs, explain that discovery supports synchronous return values and promises
- update notification service, prevent duplicate messages sent to brain
- fixed typo "addButtonHander" instead "addButtonHandler", thanks @rhuss

## 0.45.7 (8/23/2017)
- fixes error when unregistering the SDK from a Brain
- fixes parameter order in device builder documentation
- fixes switch get handler not being pass the device id
- Internal changes to decouple Express from the SDK
- Remove Timeshift button group
- Validate Image Component contains valid size

## 0.43.7 (7/19/2017)
- add new image component
- add new Record and Timeshift button groups

## 0.42.2 (6/28/2017)
- add example how to use the "Action Forward" feature
- add support for more devicetypes
- add runtime check to make sure nodejs version is valid (at lease nodejs v6.0.0)
- improved error handling of duplicate device ids from SDK
- allow empty notifications (https://github.com/NEEOInc/neeo-sdk/issues/32) fixed on NEEO Brain
- fix device unsubscribe for SDK devices (https://github.com/NEEOInc/neeo-sdk/issues/26). Please note, the SDK has NOT been updated yet
- update "listAllRecipes" example, option to override NEEO Brain IP, thanks @hardcorehead87

## 0.38.2 (5/8/2017)
- internal change, add urlbuilder, thanks @nklerk
- add support for the MEDIAPLAYER device type
- add option to define button groups
- fixes issue #15, make sure failed notification are thrown

## 0.38.0 (5/2/2017)
- make sure buttonhandler can be added only once per device definition
- make sure enableDiscovery can be added only once per device definition
- make sure registerSubscriptionFunction can be added only once per device definition
- update docs

## 0.37.2 (4/21/2017)
- handle encoded component names

## 0.36.1 (4/19/2017)
- fix invalid package

## 0.36.0 (4/19/2017)
- initial release
