# js-awe

javascript utilities and extensions

## Generating types

The library offer typescript types in ./types/ for the consumer. Currently only the main functions are typed in detail.

To generate types:
    
tsc -p tsconfig.json

This will output types in ./genTypes then we will need to copy the new type definitions into ./types/ . This is to keep the documentation that was already manually generated.

## publishing lib to npm

Change the version of the library in package.json version field. npm forces that each version published to have a unique version value.

npm publish
