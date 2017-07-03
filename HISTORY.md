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
