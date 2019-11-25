import * as child_process from 'child_process';
import * as protobufjs from 'protobufjs';
import * as assert from 'assert';
import * as Long from 'long';
import * as fs from 'fs';
import { parseSchema } from './index';
import {
  Enum,
  EnumTest,
  MapTestLongAndBool,
  MapTestIntAndString,
  Optional,
  RepeatedPacked,
  RepeatedUnpacked,
} from './test.proto';

function parseTestProto(): typeof import('./test.proto') {
  return parseSchema(fs.readFileSync('./test.proto', 'utf8')).compile();
}

function prngUint32(): () => number {
  let seed = 1;
  return () => {
    const temp = (seed * 20077 + (seed & 0xFFFF) * 1103495168 + 12345) & 0x7FFFFFFF;
    seed = (temp * 20077 + (temp & 0xFFFF) * 1103495168 + 12345) & 0x7FFFFFFF;
    return ((temp & 0xFFFF) | (seed << 16)) >>> 0;
  };
}

function* randomMessageStream(): Iterable<Optional> {
  const randomUint32 = prngUint32();
  const randomFloat64 = () => randomUint32() / (-1 >>> 0);

  for (let i = 0; i < 1000; i++) {
    yield {
      field_int32: randomUint32() | 0,
      field_int64: new Long(randomUint32(), randomUint32()),
      field_uint32: randomUint32(),
      field_uint64: new Long(randomUint32(), randomUint32(), true),
      field_sint32: randomUint32() | 0,
      field_sint64: new Long(randomUint32(), randomUint32()),
      field_fixed64: new Long(randomUint32(), randomUint32(), true),
      field_sfixed64: new Long(randomUint32(), randomUint32()),
      field_double: randomFloat64(),
      field_fixed32: randomUint32(),
      field_sfixed32: randomUint32() | 0,
      field_float: Math.fround(randomFloat64()),
    };
  }
}

////////////////////////////////////////////////////////////////////////////////

it('optional', async () => {
  const schema = parseTestProto();

  const message: Optional = {
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
    field_bytes: new Uint8Array([1, 2, 3, 4, 5]),
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
  const schema = parseTestProto();

  const message: RepeatedUnpacked = {
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
    field_bytes: [new Uint8Array([1, 2, 3, 4, 5]), new Uint8Array([]), new Uint8Array([5, 4, 3])],
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
  const schema = parseTestProto();

  const message: RepeatedPacked = {
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
    field_bytes: [new Uint8Array([1, 2, 3, 4, 5]), new Uint8Array([]), new Uint8Array([5, 4, 3])],
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

it('enum test', async () => {
  const schema = parseTestProto();

  const message: EnumTest = {
    a: Enum.B,
    b: Enum.A,
    c: [Enum.A, Enum.B],
  };

  const buffer = schema.encodeEnumTest(message);
  const message2 = schema.decodeEnumTest(buffer);
  assert.deepEqual(message2, message);
});

////////////////////////////////////////////////////////////////////////////////

it('map test (int and string keys)', async () => {
  const schema = parseTestProto();

  const message: MapTestIntAndString = {
    field_int32: { [-1]: 'testing', [1]: '🙉🙈🙊' },
    field_uint32: { [-1 >>> 0]: new Uint8Array([1, 2, 3]), [1]: new Uint8Array([254, 255]) },
    field_sint32: { [-1]: new Long(123, 234), [1]: new Long(-1, -2) },
    field_string: { 'testing': 12.34, '🙉🙈🙊': 56.78 },
    field_fixed32: { [-1 >>> 0]: false, [1]: true },
    field_sfixed32: { [-1]: { x: 2 }, [1]: { y: -2 } },
  };

  const buffer = schema.encodeMapTestIntAndString(message);
  const message2 = schema.decodeMapTestIntAndString(buffer);
  assert.deepEqual(message2, message);

  const root = new protobufjs.Root();
  await root.load('./test.proto', { keepCase: true });

  const MapTestIntAndString = root.lookupType('test.MapTestIntAndString');
  const message3 = MapTestIntAndString.decode(buffer);
  assert.deepEqual(message3, message);

  const buffer2 = MapTestIntAndString.encode(message).finish();
  assert.deepEqual(buffer2, buffer);
});

////////////////////////////////////////////////////////////////////////////////

it('map test (long and bool keys)', async () => {
  const schema = parseTestProto();

  const message: MapTestLongAndBool = {
    field_int64: { '\uFEDC\uBA98\u7654\u3210': 'testing 🙉🙈🙊' },
    field_uint64: { '\uBA98\u7654\u3210\uFEDC': new Uint8Array([0, 1, 254, 255]) },
    field_sint64: { '\u7654\u3210\uFEDC\uBA98': new Long(-1, -2) },
    field_fixed64: { '\u3210\uFEDC\uBA98\u7654': 12.34 },
    field_sfixed64: { '\uFEDC\uBA98\u7654\u3210': true },
    field_bool: { false: { x: 2 }, true: { y: -2 } },
  };

  // Note: The output can't be compared against protobuf.js because it has a
  // bug that prevents it from round-tripping 64-bit keys correctly. The keys
  // are encoded in decimal but decoded in binary. Whoops! See this for more
  // information: https://github.com/protobufjs/protobuf.js/issues/1203.
  // Because 64-bit keys are broken in protobuf.js, this library uses a more
  // efficient 16-bit encoding of 64-bit keys instead of an 8-bit encoding.
  //
  // It also seems to have a bug that breaks round-tripping boolean keys. I
  // couldn't find an associated bug but I also couldn't get it to work.

  const buffer = schema.encodeMapTestLongAndBool(message);
  const message2 = schema.decodeMapTestLongAndBool(buffer);
  assert.deepEqual(message2, message);

  const root = new protobufjs.Root();
  await root.load('./test.proto', { keepCase: true });

  // Even though we can't compare against the contents, still test that the
  // buffer is valid and can be decoded without throwing an error.
  const MapTestLongAndBool = root.lookupType('test.MapTestLongAndBool');
  MapTestLongAndBool.decode(buffer);
});

////////////////////////////////////////////////////////////////////////////////

it('fuzzing protobufjs', async () => {
  const schema = parseTestProto();

  for (const message of randomMessageStream()) {
    const buffer = schema.encodeOptional(message);
    const message2 = schema.decodeOptional(buffer);
    assert.deepEqual(message2, message);
  }
});

////////////////////////////////////////////////////////////////////////////////

it('fuzzing pbjs', async () => {
  const root = new protobufjs.Root();
  await root.load('./test.proto', { keepCase: true });
  const Optional = root.lookupType('test.Optional');

  for (const message of randomMessageStream()) {
    const buffer = Optional.encode(message).finish();
    const message2 = Optional.decode(buffer);
    assert.deepEqual(message2, message);
  }
});

////////////////////////////////////////////////////////////////////////////////

it('javascript (es5)', () => {
  const js = fs.readFileSync('./test.proto.es5.js', 'utf8');
  const js2 = parseSchema(fs.readFileSync('./test.proto', 'utf8')).toJavaScript();
  assert.strictEqual(js, js2);
});

////////////////////////////////////////////////////////////////////////////////

it('javascript (es6)', () => {
  const js = fs.readFileSync('./test.proto.es6.js', 'utf8');
  const js2 = parseSchema(fs.readFileSync('./test.proto', 'utf8')).toJavaScript({ es6: true });
  assert.strictEqual(js, js2);
});

////////////////////////////////////////////////////////////////////////////////

it('typescript', () => {
  const ts = fs.readFileSync('./test.proto.ts', 'utf8');
  const ts2 = parseSchema(fs.readFileSync('./test.proto', 'utf8')).toTypeScript();
  assert.strictEqual(ts, ts2);
});

////////////////////////////////////////////////////////////////////////////////

it('cli: generate javascript (es5)', async () => {
  try {
    fs.unlinkSync('./temp.js');
  } catch (e) {
  }
  const js = fs.readFileSync('./test.proto.es5.js', 'utf8');
  const cli = child_process.spawn('node', ['./cli.js', './test.proto', '--es5', './temp.js']);
  await new Promise(resolve => cli.on('close', resolve));
  const js2 = fs.readFileSync('./temp.js', 'utf8');
  fs.unlinkSync('./temp.js');
  assert.strictEqual(js, js2);
});

////////////////////////////////////////////////////////////////////////////////

it('cli: generate javascript (es6)', async () => {
  try {
    fs.unlinkSync('./temp.js');
  } catch (e) {
  }
  const js = fs.readFileSync('./test.proto.es6.js', 'utf8');
  const cli = child_process.spawn('node', ['./cli.js', './test.proto', '--es6', './temp.js']);
  await new Promise(resolve => cli.on('close', resolve));
  const js2 = fs.readFileSync('./temp.js', 'utf8');
  fs.unlinkSync('./temp.js');
  assert.strictEqual(js, js2);
});

////////////////////////////////////////////////////////////////////////////////

it('cli: generate typescript', async () => {
  try {
    fs.unlinkSync('./temp.ts');
  } catch (e) {
  }
  const ts = fs.readFileSync('./test.proto.ts', 'utf8');
  const cli = child_process.spawn('node', ['./cli.js', './test.proto', '--ts', './temp.ts']);
  await new Promise(resolve => cli.on('close', resolve));
  const ts2 = fs.readFileSync('./temp.ts', 'utf8');
  fs.unlinkSync('./temp.ts');
  assert.strictEqual(ts, ts2);
});

////////////////////////////////////////////////////////////////////////////////

it('cli: encode', async () => {
  const schema = parseTestProto();

  const message = {
    x: 1.5,
    y: -2.5,
  };

  const cli = child_process.spawn('node', ['./cli.js', './test.proto', '--encode', 'Nested']);
  const chunks: Buffer[] = [];

  cli.stdin.write(JSON.stringify(message));
  cli.stdin.end();

  cli.stdout.on('data', chunk => chunks.push(chunk));
  await new Promise(resolve => cli.on('close', resolve));

  assert.deepStrictEqual(new Uint8Array(Buffer.concat(chunks)), schema.encodeNested(message));
});

////////////////////////////////////////////////////////////////////////////////

it('cli: decode', async () => {
  const schema = parseTestProto();

  const message = {
    x: 1.5,
    y: -2.5,
  };

  const cli = child_process.spawn('node', ['./cli.js', './test.proto', '--decode', 'Nested']);
  const chunks: Buffer[] = [];

  cli.stdin.write(schema.encodeNested(message));
  cli.stdin.end();

  cli.stdout.on('data', chunk => chunks.push(chunk));
  await new Promise(resolve => cli.on('close', resolve));

  assert.strictEqual(Buffer.concat(chunks).toString(), JSON.stringify(message, null, 2) + '\n');
});
