# Changelog

## [1.0.4](https://github.com/MatthiasKunnen/google-search-keyboard-navigation/compare/v1.0.3...v1.0.4) (2025-03-20)

Update selectors

## [1.0.3](https://github.com/MatthiasKunnen/google-search-keyboard-navigation/compare/v1.0.2...v1.0.3) (2022-01-17)

Update selectors

## [1.0.2](https://github.com/MatthiasKunnen/google-search-keyboard-navigation/compare/v1.0.1...v1.0.2) (2021-10-30)

- Fix permanent highlight on first search result when modal is shown
- Improve extension name, description, and developer URL
- Update selectors

## [1.0.1](https://github.com/MatthiasKunnen/google-search-keyboard-navigation/compare/v1.0.0...v1.0.1) (2021-07-13)
1.0.0 was incorrectly submitted.

## [1.0.0](https://github.com/MatthiasKunnen/google-search-keyboard-navigation/compare/v1.0.0...edb7b18978dc9fb5654309cd1d547471ed80fb8a) (2021-07-13)

First version after fork. The following changes have been made:
* Selectors have been updated. They should now work again on Firefox.
* Replaced JavaScript with TypeScript and configured a linter  
  This helped detect several issues and will prevent similar ones in the future.
* Replaced usage of deprecated APIs
* Modernized code  
  The existing code used outdated and pre-ES2015 practices. The new code should be easier to read, maintain, and test.
* Eliminated dead code
* Improved development ease and wrote a guide on how to develop the extension
* Removed features that are provided by Google Search
* Removed option to add an arrow to the search result title  
  The arrow works on text only and not on the various richer results in Google Search.
* Provide dark theme for preferences
* Configure CI
