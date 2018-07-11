## UNRELEASED
- improve sensor label fallbacks
- fixes addSensor() not properly handling all different sensor types
- fixed multiroom notifications - when a device was added in several rooms, only the first room was updated with new values
- added new addAnotherDevice capability, like bridgeDevice, but for non bridge devices to show correct text.

## 0.51.4 (06/28/2018)
- added sanity check to validate the devices array
- added setListTitle function to list builder
- added addListItems function to list builder
- added setTotalMatchingItems function to list builder
- added addRootDirectory and addQueueDirectory functions, deprecated addDirectory function
- added icon buttons

## 0.51.3 (06/12/2018)
- improve brain discovery, ignore outdated NEEO Brains instead failing
- fix sdk shutdown issue when no NEEO Brain was found
- fix registration
- update and fixed documentation

## 0.50.5 (05/23/2018)
- added new device type MUSICPLAYER
- added flag to hide the label for a textlabel
- added support for lists for SDK devices
- added more sanity checks, thanks @tmrobert8
- added new bridgeDevice capability, for example a Philips Hue is a bridge device which can add multiple devices.
- added new option to register a device
- added new subscriptions to track devices used, added and removed on the Brain
- update devicestate service, added registerStateUpdate function
- implement CLI with devices start and third-party devices installation support
- added Brain version validation before starting the server
- (Breaking) addSwitch setter now provides a boolean value instead of string

## 0.49.2 (03/09/2018)
- improved validation errors to include details about the component that failed validation
- added DeviceBuilder function to set icon
- added DeviceBuilder function to set preferred display name
- added possibility to add directories that can be browsed on the SDK device
- fixes unhandled promise rejection when adapterid on incoming request is invalid
- added support for brain search on multiple network interfaces, thanks @tmrobert8
- updated dependencies

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
