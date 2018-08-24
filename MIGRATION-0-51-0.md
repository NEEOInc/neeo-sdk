# Migrate my driver to 0.51.0

From 0.50.x to 0.51.x we've moved the neeo-sdk cli to a separate project: [@neeo/cli](https://github.com/NEEOInc/neeo-sdk-toolkit/tree/master/cli).

## For SDK version 0.49.x and before

In 0.50.x we've moved towards splitting the SDK driver from the SDK server to make running multiple SDK drivers easier. See the [Driver migration guide to 0.50.0](./MIGRATION-0-50-0.md) for details.

## Changes required for the @neeo/cli

With the neeo-sdk cli (0.50.x) the setup looks like:
* `package.json` – your package definition and dependencies
* `devices/index.js` – exports your drivers as mentioned above
* `...` – the rest of your code

To make your driver @neeo/cli compatible:

1. Update main to `  "main": "devices/index.js",` in your `package.json`.

This means you can now move your main export to a different location if you would like to, all you have to do it update the `main` property of your `package.json` to the new location. This lets users of your driver (for example the @neeo/cli) know where to look for the devices you export.

Note: you should not add the `@neeo/cli` package to dependencies of your driver. If you need it include it as a devDepencencies.

The CLI can then be run using `./node_modules/bin/neeo-cli`.
