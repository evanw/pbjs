import * as child_process from 'child_process';
import * as protobufjs from 'protobufjs';
import * as assert from 'assert';
import * as Long from 'long';
import * as fs from 'fs';
import { parseSchema } from './index';

////////////////////////////////////////////////////////////////////////////////

it('optional', async () => {
  const schema = parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  const message = {
    field_int32: -1,
    field_int64: new Long(-1, -2),
    field_uint32: -1 >>> 0,
    field_uint64: new Long(-1 >>> 0, -2 >>> 0, true),
    field_sint32: -1,
    field_sint64: new Long(-1, -2),
    field_bool: true,
    field_fixed64: new Long(12345678, 87654321, true),
    field_sfixed64: new Long(-87654321, -12345678),
    field_double: 2.5,
    field_string: 'testing 🙉🙈🙊',
    field_bytes: Buffer.from([1, 2, 3, 4, 5]),
    field_fixed32: -1 >>> 0,
    field_sfixed32: -1,
    field_float: 3.25,
    field_nested: { x: 1.5 },
  };

  const buffer = schema.encodeOptional(message);
  const message2 = schema.decodeOptional(buffer);
  assert.deepEqual(message2, message);

  const root = new protobufjs.Root();
  await root.load('./test.proto', { keepCase: true });

  const Optional = root.lookupType('test.Optional');
  const message3 = Optional.decode(buffer);

  assert.deepEqual(message3, message);

  const buffer2 = Optional.encode(message).finish();
  assert.deepEqual(buffer2, buffer);
});

////////////////////////////////////////////////////////////////////////////////

it('repeated unpacked', async () => {
  const schema = parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  const message = {
    field_int32: [-1, -2],
    field_int64: [new Long(-1, -2), new Long(-3, -4)],
    field_uint32: [-1 >>> 0, -2 >>> 0],
    field_uint64: [new Long(-1 >>> 0, -2 >>> 0, true), new Long(-3 >>> 0, -4 >>> 0, true)],
    field_sint32: [-1, -2],
    field_sint64: [new Long(-1, -2), new Long(-3, -4)],
    field_bool: [true, false],
    field_fixed64: [new Long(12345678, 87654321, true), new Long(8765, 1234, true)],
    field_sfixed64: [new Long(-87654321, -12345678), new Long(-1234, -8765)],
    field_double: [2.5, -2.5],
    field_string: ['testing', '🙉🙈🙊'],
    field_bytes: [Buffer.from([1, 2, 3, 4, 5]), Buffer.from([]), Buffer.from([5, 4, 3])],
    field_fixed32: [-1 >>> 0, -2 >>> 0],
    field_sfixed32: [-1, -2],
    field_float: [3.25, -3.25],
    field_nested: [{ x: 1.5 }, {}, { y: 0.5 }],
  };

  const buffer = schema.encodeRepeatedUnpacked(message);
  const message2 = schema.decodeRepeatedUnpacked(buffer);
  assert.deepEqual(message2, message);

  const root = new protobufjs.Root();
  await root.load('./test.proto', { keepCase: true });

  const RepeatedUnpacked = root.lookupType('test.RepeatedUnpacked');
  const message3 = RepeatedUnpacked.decode(buffer);

  assert.deepEqual(message3, message);

  const buffer2 = RepeatedUnpacked.encode(message).finish();
  assert.deepEqual(buffer2, buffer);
});

////////////////////////////////////////////////////////////////////////////////

it('repeated packed', async () => {
  const schema = parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  const message = {
    field_int32: [-1, -2],
    field_int64: [new Long(-1, -2), new Long(-3, -4)],
    field_uint32: [-1 >>> 0, -2 >>> 0],
    field_uint64: [new Long(-1 >>> 0, -2 >>> 0, true), new Long(-3 >>> 0, -4 >>> 0, true)],
    field_sint32: [-1, -2],
    field_sint64: [new Long(-1, -2), new Long(-3, -4)],
    field_bool: [true, false],
    field_fixed64: [new Long(12345678, 87654321, true), new Long(8765, 1234, true)],
    field_sfixed64: [new Long(-87654321, -12345678), new Long(-1234, -8765)],
    field_double: [2.5, -2.5],
    field_string: ['testing', '🙉🙈🙊'],
    field_bytes: [Buffer.from([1, 2, 3, 4, 5]), Buffer.from([]), Buffer.from([5, 4, 3])],
    field_fixed32: [-1 >>> 0, -2 >>> 0],
    field_sfixed32: [-1, -2],
    field_float: [3.25, -3.25],
    field_nested: [{ x: 1.5 }, {}, { y: 0.5 }],
  };

  const buffer = schema.encodeRepeatedPacked(message);
  const message2 = schema.decodeRepeatedPacked(buffer);
  assert.deepEqual(message2, message);

  const root = new protobufjs.Root();
  await root.load('./test.proto', { keepCase: true });

  const RepeatedPacked = root.lookupType('test.RepeatedPacked');
  const message3 = RepeatedPacked.decode(buffer);

  assert.deepEqual(message3, message);

  const buffer2 = RepeatedPacked.encode(message).finish();
  assert.deepEqual(buffer2, buffer);
});

////////////////////////////////////////////////////////////////////////////////

it('javascript', () => {
  const js = fs.readFileSync('./test.proto.js', 'utf8');
  const js2 = parseSchema(fs.readFileSync('./test.proto', 'utf8')).toJavaScript();
  assert.strictEqual(js, js2);
});

////////////////////////////////////////////////////////////////////////////////

it('cli: generate js', async () => {
  try {
    fs.unlinkSync('./temp.js');
  } catch (e) {
  }
  const js = fs.readFileSync('./test.proto.js', 'utf8');
  const cli = child_process.spawn('node', ['./cli.js', './test.proto', '--js', './temp.js']);
  await new Promise(resolve => cli.on('close', resolve));
  const js2 = fs.readFileSync('./temp.js', 'utf8');
  fs.unlinkSync('./temp.js');
  assert.strictEqual(js, js2);
});

////////////////////////////////////////////////////////////////////////////////

it('cli: encode', async () => {
  const schema = parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  const message = {
    x: 1.5,
    y: -2.5,
  };

  const cli = child_process.spawn('node', ['./cli.js', './test.proto', '--encode', 'Nested']);
  const chunks: Buffer[] = [];

  cli.stdin.write(JSON.stringify(message));
  cli.stdin.end();

  cli.stdout.on('data', chunk => {
    chunks.push(chunk);
  });
  await new Promise(resolve => cli.on('close', resolve));

  assert.deepStrictEqual(Buffer.concat(chunks), schema.encodeNested(message));
});

////////////////////////////////////////////////////////////////////////////////

it('cli: decode', async () => {
  const schema = parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();

  const message = {
    x: 1.5,
    y: -2.5,
  };

  const cli = child_process.spawn('node', ['./cli.js', './test.proto', '--decode', 'Nested']);
  const chunks: Buffer[] = [];

  cli.stdin.write(schema.encodeNested(message));
  cli.stdin.end();

  cli.stdout.on('data', chunk => {
    chunks.push(chunk);
  });
  await new Promise(resolve => cli.on('close', resolve));

  assert.strictEqual(Buffer.concat(chunks).toString(), JSON.stringify(message, null, 2) + '\n');
});
