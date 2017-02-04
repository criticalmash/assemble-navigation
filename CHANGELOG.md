# Assemble-Navigation Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- .npmignore file
- This CHANGELOG.md file

### Changed
- `customMenuItem()` documentation stated that the `menuPath` config variable was optional, it isn't.

### Fixed
- `customMenuItem()` added check for a `menuPath` or `data['menu-path']` value in config object. Throws error if one is not present.

## [0.4.0] - 2016-08-03
Added sorting mechanism. Removed Vinyl as a peer dependency for MenuItem creation. Added flat menus.
### Added
- Sorting mechanism. Can specify a sorting function for menus.
- MenuItem options variable: MenuItem constructor now takes an optional `options` variable that overwrites variables set by the view.

### Changed
- Removed Vinyl as a peer dependency for MenuItem creation. MenuItems can now be created just by passing in a plain JS object with the correct field values. Will still accept Vinyl objects as well.
- Flat menus. Config flag to display menu items as a list instead of hierarchically.

## [0.3.0] - 2016-07-07
### Changed
- Beta Release. First Release on npm.
