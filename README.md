# NEEO SDK [![Build Status](https://travis-ci.org/NEEOInc/neeo-sdk.svg?branch=master)](https://travis-ci.org/NEEOInc/neeo-sdk)

[![Greenkeeper badge](https://badges.greenkeeper.io/NEEOInc/neeo-sdk.svg)](https://greenkeeper.io/)

This is the source code of the NEEO SDK to interact with the NEEO Brain.

If you're looking for examples, take a look at the example repository at https://github.com/NEEOInc/neeo-sdk-examples

## Prerequisite

* You must have Node.js v6 installed, see http://nodejs.org

### Windows OS

* If you use the SDK on Windows we suggest to install Apple iTunes (or the Bonjour SDK for Windows, available from the https://developer.apple.com site). Windows versions < 10 seems to miss multicast DNS support (aka. Bonjour/Zeroconf). This means the Brain discovery find's a NEEO Brain but you cannot connect to the NEEO Brain (as the discovery fails). You can test if multicast DNS works on your machine when you try to `ping NEEO-xxxxxxxx.local` (replace xxxxxxxx with the unique hostname of your NEEO Brain).

## SDK Documentation

See https://neeoinc.github.io/neeo-sdk/

# NEEO Macro Names

The view for a device in the recipe is generated automatically depending on the device capabilities.

## Power Control Capability

If your device supports Power control (power on device, power off device), add this capability - the generated recipe
will power on and off your device automatically.

You need to add support for the following buttons (`addButton({..`):
* `POWER ON`
* `POWER OFF`

or just use the shortcut function `.addButtonGroup('POWER')`


## Volume Control Capability

If your device supports Volume control (volume up and down, optional mute toggle), add this capability - the generated recipe
will automatically use the volume capability of your device.

You need to add support for the following buttons (`addButton({..`):
* `VOLUME UP`
* `VOLUME DOWN`
* optionally `MUTE TOGGLE`

or just use the shortcut function `.addButtonGroup('VOLUME')`

## Favorites View Capability

If you want support for a custom Favorite view, you need to add support for the following buttons (`addButton({..`):
* `DIGIT 0`
* `DIGIT 1`
* `DIGIT 2`
* `DIGIT 3`
* `DIGIT 4`
* `DIGIT 5`
* `DIGIT 6`
* `DIGIT 7`
* `DIGIT 8`
* `DIGIT 9`

or just use the helper function `.addButtonGroup('Numpad')`. The device must be one of the following types:

* `TV`
* `DVB` (aka Satellite box, digital receiver)
* `TUNER` (audio tuner)

## Numpad Capability

If you want to add a numpad widget to your view, make sure to implement all the `DIGIT` buttons of the "Favorites View Capability". Supported for `TV`and `DVB` devices.

## Controlpad Capability

To create a Controlpad capability you need to implement the following buttons (`addButton({..`):
* `CURSOR ENTER`
* `CURSOR UP`
* `CURSOR DOWN`
* `CURSOR LEFT`
* `CURSOR RIGHT`

or just use the helper function `.addButtonGroup('Controlpad')`. The devicetype must be `TV`, `DVB`, `GAMECONSOLE`, `MEDIAPLAYER`, `VOD`, `DVD` or `PROJECTOR`.

## Color Buttons Capability

To create a Controlpad capability you need to implement the following buttons (`addButton({..`):
* `FUNCTION RED`
* `FUNCTION GREEN`
* `FUNCTION YELLOW`
* `FUNCTION BLUE`

or just use the helper function `.addButtonGroup('Color Buttons')`. The devicetype must be `TV`, `DVB`, `GAMECONSOLE`, `MEDIAPLAYER` or `PROJECTOR`.

## MENU Capability

To create a MENU (navigation) capability you need to implement the following buttons (`addButton({..`):
* `MENU`
* `BACK`

or just use the helper function `.addButtonGroup('Menu and Back')`. In most cases it make sense to include the Controlpad capability aswell.

## Channel Zapper Capability

To create a Channel Zapper capability (Channel Up/Down) you need to implement the following buttons (`addButton({..`):
* `CHANNEL UP`
* `CHANNEL DOWN`

or just use the helper function `.addButtonGroup('Channel Zapper')`.

## Transport Capability

If you want to support different transport features (like skip, forward, next) you can include the following buttons (`addButton({..`):
* `PLAY`, `PAUSE`, `STOP` (helper function: `.addButtonGroup('Transport')`)
* `REVERSE`, `FORWARD` (helper function: `.addButtonGroup('Transport Search')`)
* `PREVIOUS`, `NEXT` (helper function: `.addButtonGroup('Transport Scan')`)
* `SKIP SECONDS BACKWARD`, `SKIP SECONDS FORWARD` (helper function: `.addButtonGroup('Transport Skip')`)

This works for the devices `TV`, `DVB`, `GAMECONSOLE`, `MEDIAPLAYER`, `VOD`, `DVD` or `PROJECTOR`.

## Record Capability

To create a Record capability you need to implement the following buttons (`addButton({..`):
* `MY RECORDINGS`
* `RECORD`
* `LIVE`

or just use the helper function `.addButtonGroup('Record')`. The devicetype must be `TV`, `DVB`. Please note, if you don't have all 3 buttons you can implement only the buttons your device provides.

## Input Capability

If you add support for a devicetype `TV`, `PROJECTOR` or `AVRECIEVER` you should provide discrete input change commands depending of your devices features, for example:
* `INPUT HDMI 1`
* `INPUT HDMI 2`
* `INPUT VGA 1`
* `INPUT SCART 1`
