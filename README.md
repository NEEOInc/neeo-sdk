# NEEO SDK [![Build Status](https://travis-ci.org/NEEOInc/neeo-sdk.svg?branch=master)](https://travis-ci.org/NEEOInc/neeo-sdk)

This is the source code of the NEEO SDK to interact with the NEEO Brain.

If you're looking for examples, take a look at the example repository at https://github.com/NEEOInc/neeo-sdk-examples

## Prerequisite

* You must have Node.js v6 installed, see http://nodejs.org

### Windows OS

* If you use the SDK on Windows we suggest to install Apple iTunes (or the Bonjour SDK for Windows, available from the https://developer.apple.com site). Windows versions < 10 seems to miss multicast DNS support (aka. Bonjour/Zeroconf). This means the Brain discovery find's a NEEO Brain but you cannot connect to the NEEO Brain (as the discovery fails). You can test if multicast DNS works on your machine when you try to `ping NEEO-xxxxxxxx.local` (replace xxxxxxxx with the unique hostname of your NEEO Brain).

## SDK Documentation

See https://neeoinc.github.io/neeo-sdk/
