# Contributing

## Running the neeo-sdk for development

* Clone the repo (or your fork of it) locally
* Install dependences
  * `npm install`
* Build the typescript files
  * `npm run build`
  * `npm run watch` (to rebuild as you make changes)
* Link the local neeo-sdk to your drivers
  * go to your driver folder
  * run `npm link PATH/TO/neeo-sdk`

## Issues and suggestions

We welcome your feedback, bug reports and suggestions to improve the SDK, you can [open an issue][issue].

[issue]: https://github.com/NEEOInc/neeo-sdk/issues/new

## Pull requests

If you see a bug or find an issue you want to contribute the solution for, we accept pull requests.

* Fork, then clone the repo
* Check out the next branch
* Make your change.
* Add tests for your change.
* Make sure tests pass and code lints
  * `npm run tslint && npm run test`
* Push to your fork back to GitHub and [submit a PR][pr].

[pr]: https://github.com/NEEOInc/neeo-sdk/compare/next...next

Then it's up to us, we'll assign the PR to one or more of our developers to review and comment.

To increase the chances that your PR is accepted:

* Write unit tests (new tests for new features, update tests for changes)
* Write descriptive commit messages
* Keep your PR small (focus on one change per PR, avoid refactoring unrelated code)
* Match the existing code style
* Avoid breaking changes
