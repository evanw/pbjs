# Protocol Buffers for JavaScript

This is a minimal implementation of [Google Protocol Buffers](https://developers.google.com/protocol-buffers/) for JavaScript and TypeScript.
It generates completely self-contained code without any dependencies.
Install it using npm:

```
npm install pbjs
```

Unlike other JavaScript implementations, this library doesn't write out default values.
This makes it possible to tell if a field has been written at all or not, which allows for efficient encoding of maps.
For example, it's possible to distinguish between a missing list and a list that is present but empty.

## Command-Line Examples

* Generate ES5 JavaScript:

  ```
  pbjs wire-format.proto --es5 wire-format.js
  ```

  See [test.proto.es5.js](https://github.com/evanw/pbjs/blob/master/test.proto.es5.js) for an example of the generated code.

* Generate ES6 JavaScript:

  ```
  pbjs wire-format.proto --es6 wire-format.js
  ```

  See [test.proto.es6.js](https://github.com/evanw/pbjs/blob/master/test.proto.es6.js) for an example of the generated code.

* Generate TypeScript:

  ```
  pbjs wire-format.proto --ts wire-format.ts
  ```

  See [test.proto.ts](https://github.com/evanw/pbjs/blob/master/test.proto.ts) for an example of the generated code.

* Convert to JSON:

  ```
  pbjs wire-format.proto --decode MessageType < wire-format.bin > wire-format.json
  ```

* Convert to Binary:

  ```
  pbjs wire-format.proto --encode MessageType < wire-format.json > wire-format.bin
  ```

## API Example

```js
const pbjs = require('pbjs');

const schema = pbjs.parseSchema(`
  message Demo {
    optional int32 x = 1;
    optional float y = 2;
  }
`).compile();

const buffer = schema.encodeDemo({x: 1, y: 2});
console.log(buffer);

const message = schema.decodeDemo(buffer);
console.log(message);
```

Running the above code should output this:

```
<Buffer 08 01 15 00 00 00 40>
{ x: 1, y: 2 }
```
