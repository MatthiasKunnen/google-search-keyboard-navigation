# Google search keyboard navigation
This extension adds keyboard functionality to Google Search.

## Building from source

Requirements:
 - yarn@^1.22.5 
 - node@>=12 <= 14 (later versions should also work)

**Build steps:**  

1. `yarn install --frozen-lockfile --production`
1. `yarn run build`
1. `yarn run pack` (optional)  
   Packs the build and source code into a zip file used for addon submission. Destination: [`./artifacts`](./artifacts).

For development instructions, see [`DEVELOPING.md`](./DEVELOPING.md).

## Firefox Extension
<https://addons.mozilla.org/en-US/firefox/addon/google-search-keyboard-nav/>

## Forked
This extension is forked from <https://github.com/jchafik/google-search-shortcuts> with the following intent:
- Quicker updates
- Firefox focused
- Simplify usage
- Modernize code
- Improve code readability
