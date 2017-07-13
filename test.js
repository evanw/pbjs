var child_process = require('child_process');
var bytebuffer = require('bytebuffer');
var protobufjs = require('protobufjs');
var assert = require('assert');
var index = require('./index');
var fs = require('fs');

////////////////////////////////////////////////////////////////////////////////

it('optional', function() {
  var schema = index.parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  var message = {
    field_int32: -1,
    field_int64: new bytebuffer.Long(-1, -2),
    field_uint32: -1 >>> 0,
    field_uint64: new bytebuffer.Long(-1 >>> 0, -2 >>> 0, true),
    field_sint32: -1,
    field_sint64: new bytebuffer.Long(-1, -2),
    field_bool: true,
    field_fixed64: new bytebuffer.Long(12345678, 87654321, true),
    field_sfixed64: new bytebuffer.Long(-87654321, -12345678),
    field_double: 2.5,
    field_string: 'testing 🙉🙈🙊',
    field_bytes: Buffer([1, 2, 3, 4, 5]),
    field_fixed32: -1 >>> 0,
    field_sfixed32: -1,
    field_float: 3.25,
    field_nested: {x: 1.5},
  };

  var buffer = schema.encodeOptional(message);
  var message2 = schema.decodeOptional(buffer);
  assert.deepEqual(message2, message);

  var schema2 = protobufjs.loadProtoFile('./test.proto').build('test');
  var message3 = schema2.Optional.decode(buffer);

  // Bypass bugs in protobuf.js
  message3.field_bytes = message3.field_bytes.toBuffer();
  delete message3.field_nested.y;

  assert.deepEqual(message3, message);

  var buffer2 = schema2.Optional.encode(message).toBuffer();
  assert.deepEqual(buffer2, buffer);
});

////////////////////////////////////////////////////////////////////////////////

it('repeated unpacked', function() {
  var schema = index.parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  var message = {
    field_int32: [-1, -2],
    field_int64: [new bytebuffer.Long(-1, -2), new bytebuffer.Long(-3, -4)],
    field_uint32: [-1 >>> 0, -2 >>> 0],
    field_uint64: [new bytebuffer.Long(-1 >>> 0, -2 >>> 0, true), new bytebuffer.Long(-3 >>> 0, -4 >>> 0, true)],
    field_sint32: [-1, -2],
    field_sint64: [new bytebuffer.Long(-1, -2), new bytebuffer.Long(-3, -4)],
    field_bool: [true, false],
    field_fixed64: [new bytebuffer.Long(12345678, 87654321, true), new bytebuffer.Long(8765, 1234, true)],
    field_sfixed64: [new bytebuffer.Long(-87654321, -12345678), new bytebuffer.Long(-1234, -8765)],
    field_double: [2.5, -2.5],
    field_string: ['testing', '🙉🙈🙊'],
    field_bytes: [Buffer([1, 2, 3, 4, 5]), Buffer([]), Buffer([5, 4, 3])],
    field_fixed32: [-1 >>> 0, -2 >>> 0],
    field_sfixed32: [-1, -2],
    field_float: [3.25, -3.25],
    field_nested: [{x: 1.5}, {}, {y: 0.5}],
  };

  var buffer = schema.encodeRepeatedUnpacked(message);
  var message2 = schema.decodeRepeatedUnpacked(buffer);
  assert.deepEqual(message2, message);

  var schema2 = protobufjs.loadProtoFile('./test.proto').build('test');
  var message3 = schema2.RepeatedUnpacked.decode(buffer);

  // Bypass bugs in protobuf.js
  message3.field_bytes[0] = message3.field_bytes[0].toBuffer();
  message3.field_bytes[1] = message3.field_bytes[1].toBuffer();
  message3.field_bytes[2] = message3.field_bytes[2].toBuffer();
  delete message3.field_nested[0].y;
  delete message3.field_nested[1].x;
  delete message3.field_nested[1].y;
  delete message3.field_nested[2].x;

  assert.deepEqual(message3, message);

  var buffer2 = schema2.RepeatedUnpacked.encode(message).toBuffer();
  assert.deepEqual(buffer2, buffer);
});

////////////////////////////////////////////////////////////////////////////////

it('repeated packed', function() {
  var schema = index.parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  var message = {
    field_int32: [-1, -2],
    field_int64: [new bytebuffer.Long(-1, -2), new bytebuffer.Long(-3, -4)],
    field_uint32: [-1 >>> 0, -2 >>> 0],
    field_uint64: [new bytebuffer.Long(-1 >>> 0, -2 >>> 0, true), new bytebuffer.Long(-3 >>> 0, -4 >>> 0, true)],
    field_sint32: [-1, -2],
    field_sint64: [new bytebuffer.Long(-1, -2), new bytebuffer.Long(-3, -4)],
    field_bool: [true, false],
    field_fixed64: [new bytebuffer.Long(12345678, 87654321, true), new bytebuffer.Long(8765, 1234, true)],
    field_sfixed64: [new bytebuffer.Long(-87654321, -12345678), new bytebuffer.Long(-1234, -8765)],
    field_double: [2.5, -2.5],
    field_string: ['testing', '🙉🙈🙊'],
    field_bytes: [Buffer([1, 2, 3, 4, 5]), Buffer([]), Buffer([5, 4, 3])],
    field_fixed32: [-1 >>> 0, -2 >>> 0],
    field_sfixed32: [-1, -2],
    field_float: [3.25, -3.25],
    field_nested: [{x: 1.5}, {}, {y: 0.5}],
  };

  var buffer = schema.encodeRepeatedPacked(message);
  var message2 = schema.decodeRepeatedPacked(buffer);
  assert.deepEqual(message2, message);

  var schema2 = protobufjs.loadProtoFile('./test.proto').build('test');
  var message3 = schema2.RepeatedPacked.decode(buffer);

  // Bypass bugs in protobuf.js
  message3.field_bytes[0] = message3.field_bytes[0].toBuffer();
  message3.field_bytes[1] = message3.field_bytes[1].toBuffer();
  message3.field_bytes[2] = message3.field_bytes[2].toBuffer();
  delete message3.field_nested[0].y;
  delete message3.field_nested[1].x;
  delete message3.field_nested[1].y;
  delete message3.field_nested[2].x;

  assert.deepEqual(message3, message);

  var buffer2 = schema2.RepeatedPacked.encode(message).toBuffer();
  assert.deepEqual(buffer2, buffer);
});

////////////////////////////////////////////////////////////////////////////////

it('javascript', function() {
  var js = fs.readFileSync('./test.proto.js', 'utf8');
  var js2 = index.parseSchema(fs.readFileSync('./test.proto', 'utf8')).toJavaScript();
  assert.strictEqual(js, js2);
});

////////////////////////////////////////////////////////////////////////////////

it('cli: generate js', function(done) {
  fs.unlink('./temp.js', function() {
    var js = fs.readFileSync('./test.proto.js', 'utf8');
    child_process.spawn('node', ['./cli.js', './test.proto', '--js', './temp.js']).on('close', function() {
      var js2 = fs.readFileSync('./temp.js', 'utf8');
      fs.unlink('./temp.js', function() {
        try {
          assert.strictEqual(js, js2);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});

////////////////////////////////////////////////////////////////////////////////

it('cli: encode', function(done) {
  var schema = index.parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  var message = {
    x: 1.5,
    y: -2.5,
  };

  var cli = child_process.spawn('node', ['./cli.js', './test.proto', '--encode', 'Nested']);
  var chunks = [];

  cli.stdin.write(JSON.stringify(message));
  cli.stdin.end();

  cli.stdout.on('data', function(chunk) {
    chunks.push(chunk);
  });

  cli.on('close', function() {
    try {
      assert.deepStrictEqual(Buffer.concat(chunks), schema.encodeNested(message));
      done();
    } catch (e) {
      done(e);
    }
  });
});

////////////////////////////////////////////////////////////////////////////////

it('cli: decode', function(done) {
  var schema = index.parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  var message = {
    x: 1.5,
    y: -2.5,
  };

  var cli = child_process.spawn('node', ['./cli.js', './test.proto', '--decode', 'Nested']);
  var chunks = [];

  cli.stdin.write(schema.encodeNested(message));
  cli.stdin.end();

  cli.stdout.on('data', function(chunk) {
    chunks.push(chunk);
  });

  cli.on('close', function() {
    try {
      assert.strictEqual(Buffer.concat(chunks).toString(), JSON.stringify(message, null, 2) + '\n');
      done();
    } catch (e) {
      done(e);
    }
  });
});
