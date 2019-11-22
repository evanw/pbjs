const child_process = require('child_process');
const bytebuffer = require('bytebuffer');
const protobufjs = require('protobufjs');
const assert = require('assert');
const index = require('./index');
const fs = require('fs');

////////////////////////////////////////////////////////////////////////////////

it('optional', () => {
  const schema = index.parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  const message = {
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
    field_nested: { x: 1.5 },
  };

  const buffer = schema.encodeOptional(message);
  const message2 = schema.decodeOptional(buffer);
  assert.deepEqual(message2, message);

  const schema2 = protobufjs.loadProtoFile('./test.proto').build('test');
  const message3 = schema2.Optional.decode(buffer);

  // Bypass bugs in protobuf.js
  message3.field_bytes = message3.field_bytes.toBuffer();
  delete message3.field_nested.y;

  assert.deepEqual(message3, message);

  const buffer2 = schema2.Optional.encode(message).toBuffer();
  assert.deepEqual(buffer2, buffer);
});

////////////////////////////////////////////////////////////////////////////////

it('repeated unpacked', () => {
  const schema = index.parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  const message = {
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
    field_nested: [{ x: 1.5 }, {}, { y: 0.5 }],
  };

  const buffer = schema.encodeRepeatedUnpacked(message);
  const message2 = schema.decodeRepeatedUnpacked(buffer);
  assert.deepEqual(message2, message);

  const schema2 = protobufjs.loadProtoFile('./test.proto').build('test');
  const message3 = schema2.RepeatedUnpacked.decode(buffer);

  // Bypass bugs in protobuf.js
  message3.field_bytes[0] = message3.field_bytes[0].toBuffer();
  message3.field_bytes[1] = message3.field_bytes[1].toBuffer();
  message3.field_bytes[2] = message3.field_bytes[2].toBuffer();
  delete message3.field_nested[0].y;
  delete message3.field_nested[1].x;
  delete message3.field_nested[1].y;
  delete message3.field_nested[2].x;

  assert.deepEqual(message3, message);

  const buffer2 = schema2.RepeatedUnpacked.encode(message).toBuffer();
  assert.deepEqual(buffer2, buffer);
});

////////////////////////////////////////////////////////////////////////////////

it('repeated packed', () => {
  const schema = index.parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  const message = {
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
    field_nested: [{ x: 1.5 }, {}, { y: 0.5 }],
  };

  const buffer = schema.encodeRepeatedPacked(message);
  const message2 = schema.decodeRepeatedPacked(buffer);
  assert.deepEqual(message2, message);

  const schema2 = protobufjs.loadProtoFile('./test.proto').build('test');
  const message3 = schema2.RepeatedPacked.decode(buffer);

  // Bypass bugs in protobuf.js
  message3.field_bytes[0] = message3.field_bytes[0].toBuffer();
  message3.field_bytes[1] = message3.field_bytes[1].toBuffer();
  message3.field_bytes[2] = message3.field_bytes[2].toBuffer();
  delete message3.field_nested[0].y;
  delete message3.field_nested[1].x;
  delete message3.field_nested[1].y;
  delete message3.field_nested[2].x;

  assert.deepEqual(message3, message);

  const buffer2 = schema2.RepeatedPacked.encode(message).toBuffer();
  assert.deepEqual(buffer2, buffer);
});

////////////////////////////////////////////////////////////////////////////////

it('javascript', () => {
  const js = fs.readFileSync('./test.proto.js', 'utf8');
  const js2 = index.parseSchema(fs.readFileSync('./test.proto', 'utf8')).toJavaScript();
  assert.strictEqual(js, js2);
});

////////////////////////////////////////////////////////////////////////////////

it('cli: generate js', done => {
  fs.unlink('./temp.js', () => {
    const js = fs.readFileSync('./test.proto.js', 'utf8');
    child_process.spawn('node', ['./cli.js', './test.proto', '--js', './temp.js']).on('close', () => {
      const js2 = fs.readFileSync('./temp.js', 'utf8');
      fs.unlink('./temp.js', () => {
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

it('cli: encode', done => {
  const schema = index.parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  const message = {
    x: 1.5,
    y: -2.5,
  };

  const cli = child_process.spawn('node', ['./cli.js', './test.proto', '--encode', 'Nested']);
  const chunks = [];

  cli.stdin.write(JSON.stringify(message));
  cli.stdin.end();

  cli.stdout.on('data', chunk => {
    chunks.push(chunk);
  });

  cli.on('close', () => {
    try {
      assert.deepStrictEqual(Buffer.concat(chunks), schema.encodeNested(message));
      done();
    } catch (e) {
      done(e);
    }
  });
});

////////////////////////////////////////////////////////////////////////////////

it('cli: decode', done => {
  const schema = index.parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  const message = {
    x: 1.5,
    y: -2.5,
  };

  const cli = child_process.spawn('node', ['./cli.js', './test.proto', '--decode', 'Nested']);
  const chunks = [];

  cli.stdin.write(schema.encodeNested(message));
  cli.stdin.end();

  cli.stdout.on('data', chunk => {
    chunks.push(chunk);
  });

  cli.on('close', () => {
    try {
      assert.strictEqual(Buffer.concat(chunks).toString(), JSON.stringify(message, null, 2) + '\n');
      done();
    } catch (e) {
      done(e);
    }
  });
});
