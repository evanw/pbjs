# Protocol Buffers for JavaScript

This is a minimal implementation of [Google Protocol Buffers](https://developers.google.com/protocol-buffers/) for JavaScript.
Install it using npm:

```
npm install pbjs
```

Unlike other JavaScript implementations, this library doesn't write out default values.
This makes it possible to tell if a field has been written at all or not, which allows for efficient encoding of maps.
For example, it's possible to distinguish between a missing list and a list that is present but empty.

## Command-Line Examples

* Generate JavaScript:

  ```
  pbjs wire-format.proto --js wire-format.js
  ```

  The generated code depends only on [bytebuffer.js](https://github.com/dcodeIO/bytebuffer.js).
  See [test.proto.js](https://github.com/evanw/pbjs/blob/master/test.proto.js) for an example of the generated code.

* Convert to JSON:

  ```
  pbjs wire-format.proto --decode MessageType < wire-format.bin > wire-format.json
  ```

* Convert to Binary:

  ```
  pbjs wire-format.proto --encode MessageType < wire-format.json > wire-format.bin
  ```

The generated JavaScript code

## API Example

```JavaScript
var pbjs = require('pbjs');
var fs = require('fs');

var schema = pbjs.parseSchema([
  'message Demo {',
  '  optional int32 x = 1;',
  '  optional float y = 2;',
  '}',
].join('\n')).compile();

var buffer = schema.encodeDemo({x: 1, y: 2});
console.log(buffer);

var message = schema.decodeDemo(buffer);
console.log(message);
```

Running the above code should output this:

```
<Buffer 08 01 15 00 00 00 40>
{ x: 1, y: 2 }
```
