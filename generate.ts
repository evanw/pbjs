import { Schema } from "protocol-buffers-schema";

function quote(value: any): string {
  return JSON.stringify(value, null, 2);
}

export interface Options {
  typescript?: boolean;
  es6?: boolean;
}

export function generate(schema: Schema, options?: Options): string {
  options = options || {};
  let pkg = 'exports';
  const typescript = !!options.typescript;
  const es6 = typescript || !!options.es6;
  const varOrLet = es6 ? 'let' : 'var';
  const prefix = es6 ? '' : pkg + '.';
  const enums: { [key: string]: boolean } = {};
  const lines: string[] = [];

  const packableTypes: { [type: string]: boolean } = {
    'bool': true,
    'double': true,
    'fixed32': true,
    'fixed64': true,
    'float': true,
    'int32': true,
    'int64': true,
    'sfixed32': true,
    'sfixed64': true,
    'sint32': true,
    'sint64': true,
    'uint32': true,
    'uint64': true,
  };

  function ts(code: string): string {
    return typescript ? ': ' + code : '';
  }

  const TYPE_VAR_INT = 0;
  const TYPE_SIZE_8 = 1;
  const TYPE_SIZE_N = 2;
  const TYPE_SIZE_4 = 5;

  function codeForEnumExport(name: string): string {
    return es6 ? `export const ${name}` : `${pkg}.${name}`;
  }

  for (const def of schema.enums) {
    const prefix = def.name + '_';
    const items: string[] = [];
    const encode: string[] = [];
    const decode: string[] = [];

    for (let key in def.values) {
      const value = def.values[key];

      // Protocol buffers made the stupid decision to use C-style enum scoping
      // rules. Attempt to fix this by stripping the "EnumType_" prefix if present.
      if (key.slice(0, prefix.length) === prefix) {
        key = key.slice(prefix.length);
      }

      items.push(`  ${key} = ${quote(key)},`);
      encode.push(`  ${key}: ${value.value},`);
      decode.push(`  ${value.value}: ${typescript ? `${def.name}.${key}` : quote(key)},`);
    }

    if (typescript) {
      lines.push(`export const enum ${def.name} {`);
      lines.push.apply(lines, items);
      lines.push(`}`);
      lines.push(``);
    }

    lines.push(`${codeForEnumExport('encode' + def.name)}${ts(`{ [key: string]: number }`)} = {`);
    lines.push.apply(lines, encode);
    lines.push(`};`);
    lines.push('');

    lines.push(`${codeForEnumExport('decode' + def.name)}${ts(`{ [key: number]: ${def.name} }`)} = {`);
    lines.push.apply(lines, decode);
    lines.push(`};`);
    lines.push('');

    enums[def.name] = true;
    packableTypes[def.name] = true;
  }

  // Validate the "packed" option once
  for (const def of schema.messages) {
    for (const field of def.fields) {
      if (field.options.packed === 'true' && (!field.repeated || !(field.type in packableTypes))) {
        throw new Error(field.name + ': [packed = true] can only be specified for repeated primitive fields');
      }
    }
  }

  function codeForFunctionExport(name: string): string {
    return es6 ? `export function ${name}` : `${pkg}.${name} = function `;
  }

  for (const def of schema.messages) {
    if (typescript) {
      lines.push(`export interface ${def.name} {`);

      for (const field of def.fields) {
        let type: string;

        switch (field.type) {
          case 'bool':
            type = 'boolean';
            break;

          case 'bytes':
            type = 'Uint8Array';
            break;

          case 'double':
          case 'fixed32':
          case 'float':
          case 'int32':
          case 'sfixed32':
          case 'sint32':
          case 'uint32':
            type = 'number';
            break;

          case 'fixed64':
          case 'int64':
          case 'sfixed64':
          case 'sint64':
          case 'uint64':
            type = 'Long';
            break;

          default:
            type = field.type;
            break;
        }

        const required = field.required ? '' : '?';
        const repeated = field.repeated ? '[]' : '';
        lines.push(`  ${field.name}${required}: ${type}${repeated};`);
      }

      lines.push(`}`);
      lines.push(``);
    }

    lines.push(`${codeForFunctionExport('encode' + def.name)}(message${ts(def.name)})${ts('Uint8Array')} {`);
    lines.push(`  ${varOrLet} bb = newByteBuffer();`);
    lines.push(``);

    for (const field of def.fields) {
      const isPacked = field.repeated && field.options.packed !== 'false' && field.type in packableTypes;
      const buffer = isPacked ? 'packed' : 'bb';
      const modifier = field.repeated ? 'repeated ' : field.required ? 'required ' : 'optional ';
      const value = `$${field.name}`;
      let type = 0;
      let write = null;
      let before = null;

      lines.push(`  // ${modifier}${field.type} ${field.name} = ${field.tag};`);

      switch (field.type) {
        case 'bool': type = TYPE_VAR_INT; write = `writeByte(${buffer}, ${value} ? 1 : 0)`; break;
        case 'bytes': type = TYPE_SIZE_N; write = `writeVarint32(${buffer}, ${value}.length), writeBytes(${buffer}, ${value})`; break;
        case 'double': type = TYPE_SIZE_8; write = `writeDouble(${buffer}, ${value})`; break;
        case 'fixed32': type = TYPE_SIZE_4; write = `writeInt32(${buffer}, ${value})`; break;
        case 'fixed64': type = TYPE_SIZE_8; write = `writeInt64(${buffer}, ${value})`; break;
        case 'float': type = TYPE_SIZE_4; write = `writeFloat(${buffer}, ${value})`; break;
        case 'int32': type = TYPE_VAR_INT; write = `writeVarint64(${buffer}, intToLong(${value}))`; break;
        case 'int64': type = TYPE_VAR_INT; write = `writeVarint64(${buffer}, ${value})`; break;
        case 'sfixed32': type = TYPE_SIZE_4; write = `writeInt32(${buffer}, ${value})`; break;
        case 'sfixed64': type = TYPE_SIZE_8; write = `writeInt64(${buffer}, ${value})`; break;
        case 'sint32': type = TYPE_VAR_INT; write = `writeVarint32ZigZag(${buffer}, ${value})`; break;
        case 'sint64': type = TYPE_VAR_INT; write = `writeVarint64ZigZag(${buffer}, ${value})`; break;
        case 'uint32': type = TYPE_VAR_INT; write = `writeVarint32(${buffer}, ${value})`; break;
        case 'uint64': type = TYPE_VAR_INT; write = `writeVarint64(${buffer}, ${value})`; break;

        case 'string': {
          type = TYPE_SIZE_N;
          before = `${varOrLet} nested = utf8Encoder.encode(${value})`;
          write = `writeVarint32(${buffer}, nested.length), writeBytes(${buffer}, nested)`;
          break;
        }

        default: {
          if (field.type in enums) {
            type = TYPE_VAR_INT;
            write = `writeVarint32(${buffer}, ${prefix}encode${field.type}[${value}])`;
          } else {
            type = TYPE_SIZE_N;
            before = `${varOrLet} nested = ${prefix}encode${field.type}(${value})`;
            write = `writeVarint32(${buffer}, nested.length), writeBytes(${buffer}, nested)`;
          }
          break;
        }
      }

      if (field.repeated) {
        const array = `array$${field.name}`;
        lines.push(`  ${varOrLet} ${array} = message.${field.name};`);
        lines.push(`  if (${array} !== undefined) {`);

        if (isPacked) {
          lines.push(`    ${varOrLet} packed = newByteBuffer();`);
          if (es6) {
            lines.push(`    for (const ${value} of ${array}) {`);
          } else {
            lines.push(`    for (var i = 0; i < ${array}.length; i++) {`);
            lines.push(`      var ${value} = ${array}[i];`);
          }
          if (before) lines.push(`      ${before};`);
          lines.push(`      ${write};`);
          lines.push(`    }`);
          lines.push(`    writeVarint32(bb, ${(field.tag << 3) | TYPE_SIZE_N});`);
          lines.push(`    writeVarint32(bb, packed.offset);`);
          lines.push(`    writeBytes(bb, toUint8Array(packed));`);
        }

        else {
          if (es6) {
            lines.push(`    for (const ${value} of ${array}) {`);
          } else {
            lines.push(`    for (var i = 0; i < ${array}.length; i++) {`);
            lines.push(`      var ${value} = ${array}[i];`);
          }
          if (before) lines.push(`      ${before};`);
          lines.push(`      writeVarint32(bb, ${(field.tag << 3) | type});`);
          lines.push(`      ${write};`);
          lines.push(`    }`);
        }

        lines.push(`  }`);
        lines.push(``);
      }

      else {
        lines.push(`  ${varOrLet} ${value} = message.${field.name};`);
        lines.push(`  if (${value} !== undefined) {`);
        lines.push(`    writeVarint32(bb, ${(field.tag << 3) | type});`);
        if (before) lines.push(`    ${before};`);
        lines.push(`    ${write};`);
        lines.push(`  }`);
        lines.push(``);
      }
    }

    lines.push(`  return toUint8Array(bb);`);
    lines.push(es6 ? '}' : '};');
    lines.push(``);

    lines.push(`${codeForFunctionExport('decode' + def.name)}(binary${ts('ByteBuffer | Uint8Array')})${ts(def.name)} {`);
    lines.push(`  ${varOrLet} message${ts(def.name)} = {}${typescript ? ' as any' : ''};`);
    lines.push(`  ${varOrLet} bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;`);
    lines.push(``);
    lines.push(`  end_of_message: while (!isAtEnd(bb)) {`);
    lines.push(`    ${varOrLet} tag = readVarint32(bb);`);
    lines.push(``);
    lines.push(`    switch (tag >>> 3) {`);
    lines.push(`      case 0:`);
    lines.push(`        break end_of_message;`);
    lines.push(``);

    for (const field of def.fields) {
      const modifier = field.repeated ? 'repeated ' : field.required ? 'required ' : 'optional ';
      let read = null;
      let after = null;

      lines.push(`      // ${modifier}${field.type} ${field.name} = ${field.tag};`);
      lines.push(`      case ${field.tag}: {`);

      switch (field.type) {
        case 'bool': read = `!!readByte(bb)`; break;
        case 'bytes': read = `readBytes(bb, readVarint32(bb))`; break;
        case 'double': read = `readDouble(bb)`; break;
        case 'fixed32': read = `readInt32(bb) >>> 0`; break;
        case 'fixed64': read = `readInt64(bb, /* unsigned */ true)`; break;
        case 'float': read = `readFloat(bb)`; break;
        case 'int32': read = `readVarint32(bb)`; break;
        case 'int64': read = `readVarint64(bb, /* unsigned */ false)`; break;
        case 'sfixed32': read = `readInt32(bb)`; break;
        case 'sfixed64': read = `readInt64(bb, /* unsigned */ false)`; break;
        case 'sint32': read = `readVarint32ZigZag(bb)`; break;
        case 'sint64': read = `readVarint64ZigZag(bb)`; break;
        case 'string': read = `utf8Decoder.decode(readBytes(bb, readVarint32(bb)))`; break;
        case 'uint32': read = `readVarint32(bb) >>> 0`; break;
        case 'uint64': read = `readVarint64(bb, /* unsigned */ true)`; break;

        default: {
          if (field.type in enums) {
            read = `${prefix}decode${field.type}[readVarint32(bb)]`;
          } else {
            lines.push(`        ${varOrLet} limit = pushTemporaryLength(bb);`);
            read = `${prefix}decode${field.type}(bb)`;
            after = 'bb.limit = limit';
          }
          break;
        }
      }

      if (field.repeated) {
        lines.push(`        ${varOrLet} values = message.${field.name} || (message.${field.name} = []);`);

        // Support both packed and unpacked encodings for primitive types
        if (field.type in packableTypes) {
          lines.push(`        if ((tag & 7) === ${TYPE_SIZE_N}) {`);
          lines.push(`          ${varOrLet} outerLimit = pushTemporaryLength(bb);`);
          lines.push(`          while (!isAtEnd(bb)) {`);
          lines.push(`            values.push(${read});`);
          if (after) lines.push(`            ${after};`);
          lines.push(`          }`);
          lines.push(`          bb.limit = outerLimit;`);
          lines.push(`        } else {`);
          lines.push(`          values.push(${read});`);
          if (after) lines.push(`          ${after};`);
          lines.push(`        }`);
        }

        else {
          lines.push(`        values.push(${read});`);
          if (after) lines.push(`        ${after};`);
        }
      }

      else {
        lines.push(`        message.${field.name} = ${read};`);
        if (after) lines.push(`        ${after};`);
      }

      lines.push(`        break;`);
      lines.push(`      }`);
      lines.push(``);
    }

    lines.push(`      default:`);
    lines.push(`        skipUnknownField(bb, tag & 7);`);
    lines.push(`    }`);
    lines.push(`  }`);
    lines.push(``);

    for (const field of def.fields) {
      if (field.required) {
        lines.push(`  if (message.${field.name} === undefined)`);
        lines.push(`    throw new Error(${quote(`Missing required field: ${field.name}`)});`);
        lines.push(``);
      }
    }

    lines.push(`  return message;`);
    lines.push(es6 ? '}' : '};');
    lines.push(``);
  }

  if (typescript) {
    lines.push('interface Long {');
    lines.push('  low: number;');
    lines.push('  high: number;');
    lines.push('  unsigned: boolean;');
    lines.push('}');
    lines.push('');
    lines.push('interface ByteBuffer {');
    lines.push('  bytes: Uint8Array;');
    lines.push('  offset: number;');
    lines.push('  limit: number;');
    lines.push('}');
    lines.push('');
  }

  lines.push(`function pushTemporaryLength(bb${ts('ByteBuffer')})${ts('number')} {`);
  lines.push(`  ${varOrLet} length = readVarint32(bb);`);
  lines.push(`  ${varOrLet} limit = bb.limit;`);
  lines.push(`  bb.limit = bb.offset + length;`);
  lines.push(`  return limit;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function skipUnknownField(bb${ts('ByteBuffer')}, type${ts('number')})${ts('void')} {`);
  lines.push(`  switch (type) {`);
  lines.push(`    case ${TYPE_VAR_INT}: while (readByte(bb) & 0x80) { } break;`);
  lines.push(`    case ${TYPE_SIZE_N}: skip(bb, readVarint32(bb)); break;`);
  lines.push(`    case ${TYPE_SIZE_4}: skip(bb, 4); break;`);
  lines.push(`    case ${TYPE_SIZE_8}: skip(bb, 8); break;`);
  lines.push(`    default: throw new Error("Unimplemented type: " + type);`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`// The code below was modified from https://github.com/protobufjs/bytebuffer.js`);
  lines.push(`// which is under the Apache License 2.0.`);
  lines.push(``);

  lines.push(`${varOrLet} utf8Decoder = new TextDecoder();`);
  lines.push(`${varOrLet} utf8Encoder = new TextEncoder();`);
  lines.push(``);

  lines.push(`${varOrLet} f32 = new Float32Array(1);`);
  lines.push(`${varOrLet} f32_u8 = new Uint8Array(f32.buffer);`);
  lines.push(``);

  lines.push(`${varOrLet} f64 = new Float64Array(1);`);
  lines.push(`${varOrLet} f64_u8 = new Uint8Array(f64.buffer);`);
  lines.push(``);

  lines.push(`function intToLong(value${ts('number')})${ts('Long')} {`);
  lines.push(`  value |= 0;`);
  lines.push(`  return {`);
  lines.push(`    low: value,`);
  lines.push(`    high: value >> 31,`);
  lines.push(`    unsigned: value >= 0,`);
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function newByteBuffer(bytes${typescript ? '?: Uint8Array' : ''})${ts('ByteBuffer')} {`);
  lines.push(`  if (bytes) {`);
  lines.push(`    return { bytes, offset: 0, limit: bytes.length };`);
  lines.push(`  } else {`);
  lines.push(`    return { bytes: new Uint8Array(64), offset: 0, limit: 0 };`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function toUint8Array(bb${ts('ByteBuffer')})${ts('Uint8Array')} {`);
  lines.push(`  ${varOrLet} bytes = bb.bytes;`);
  lines.push(`  ${varOrLet} limit = bb.limit;`);
  lines.push(`  return bytes.length === limit ? bytes : bytes.subarray(0, limit);`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function skip(bb${ts('ByteBuffer')}, offset${ts('number')})${ts('void')} {`);
  lines.push(`  if (bb.offset + offset > bb.limit) {`);
  lines.push(`    throw new Error('Skip past limit');`);
  lines.push(`  }`);
  lines.push(`  bb.offset += offset;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function isAtEnd(bb${ts('ByteBuffer')})${ts('boolean')} {`);
  lines.push(`  return bb.offset >= bb.limit;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function grow(bb${ts('ByteBuffer')}, count${ts('number')})${ts('number')} {`);
  lines.push(`  ${varOrLet} bytes = bb.bytes;`);
  lines.push(`  ${varOrLet} offset = bb.offset;`);
  lines.push(`  ${varOrLet} limit = bb.limit;`);
  lines.push(`  ${varOrLet} finalOffset = offset + count;`);
  lines.push(`  if (finalOffset > bytes.length) {`);
  lines.push(`    ${varOrLet} newBytes = new Uint8Array(finalOffset * 2);`);
  lines.push(`    newBytes.set(bytes);`);
  lines.push(`    bb.bytes = newBytes;`);
  lines.push(`  }`);
  lines.push(`  bb.offset = finalOffset;`);
  lines.push(`  if (finalOffset > limit) {`);
  lines.push(`    bb.limit = finalOffset;`);
  lines.push(`  }`);
  lines.push(`  return offset;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function advance(bb${ts('ByteBuffer')}, count${ts('number')})${ts('number')} {`);
  lines.push(`  ${varOrLet} offset = bb.offset;`);
  lines.push(`  if (offset + count > bb.limit) {`);
  lines.push(`    throw new Error('Read past limit');`);
  lines.push(`  }`);
  lines.push(`  bb.offset += count;`);
  lines.push(`  return offset;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function readBytes(bb${ts('ByteBuffer')}, count${ts('number')})${ts('Uint8Array')} {`);
  lines.push(`  ${varOrLet} offset = advance(bb, count);`);
  lines.push(`  return bb.bytes.subarray(offset, offset + count);`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeBytes(bb${ts('ByteBuffer')}, buffer${ts('Uint8Array')})${ts('void')} {`);
  lines.push(`  ${varOrLet} offset = grow(bb, buffer.length);`);
  lines.push(`  bb.bytes.set(buffer, offset);`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function readByte(bb${ts('ByteBuffer')})${ts('number')} {`);
  lines.push(`  return bb.bytes[advance(bb, 1)];`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeByte(bb${ts('ByteBuffer')}, value${ts('number')})${ts('void')} {`);
  lines.push(`  ${varOrLet} offset = grow(bb, 1);`);
  lines.push(`  bb.bytes[offset] = value;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function readFloat(bb${ts('ByteBuffer')})${ts('number')} {`);
  lines.push(`  ${varOrLet} offset = advance(bb, 4);`);
  lines.push(`  f32_u8.set(bb.bytes.subarray(offset, offset + 4));`);
  lines.push(`  return f32[0];`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeFloat(bb${ts('ByteBuffer')}, value${ts('number')})${ts('void')} {`);
  lines.push(`  ${varOrLet} offset = grow(bb, 4);`);
  lines.push(`  f32[0] = value;`);
  lines.push(`  bb.bytes.set(f32_u8, offset);`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function readDouble(bb${ts('ByteBuffer')})${ts('number')} {`);
  lines.push(`  ${varOrLet} offset = advance(bb, 8);`);
  lines.push(`  f64_u8.set(bb.bytes.subarray(offset, offset + 8));`);
  lines.push(`  return f64[0];`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeDouble(bb${ts('ByteBuffer')}, value${ts('number')})${ts('void')} {`);
  lines.push(`  ${varOrLet} offset = grow(bb, 8);`);
  lines.push(`  f64[0] = value;`);
  lines.push(`  bb.bytes.set(f64_u8, offset);`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function readInt32(bb${ts('ByteBuffer')})${ts('number')} {`);
  lines.push(`  ${varOrLet} offset = advance(bb, 4);`);
  lines.push(`  ${varOrLet} bytes = bb.bytes;`);
  lines.push(`  return (`);
  lines.push(`    bytes[offset] |`);
  lines.push(`    (bytes[offset + 1] << 8) |`);
  lines.push(`    (bytes[offset + 2] << 16) |`);
  lines.push(`    (bytes[offset + 3] << 24)`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeInt32(bb${ts('ByteBuffer')}, value${ts('number')})${ts('void')} {`);
  lines.push(`  ${varOrLet} offset = grow(bb, 4);`);
  lines.push(`  ${varOrLet} bytes = bb.bytes;`);
  lines.push(`  bytes[offset] = value;`);
  lines.push(`  bytes[offset + 1] = value >> 8;`);
  lines.push(`  bytes[offset + 2] = value >> 16;`);
  lines.push(`  bytes[offset + 3] = value >> 24;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function readInt64(bb${ts('ByteBuffer')}, unsigned${ts('boolean')})${ts('Long')} {`);
  lines.push(`  return {`);
  lines.push(`    low: readInt32(bb),`);
  lines.push(`    high: readInt32(bb),`);
  lines.push(`    unsigned,`);
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeInt64(bb${ts('ByteBuffer')}, value${ts('Long')})${ts('void')} {`);
  lines.push(`  writeInt32(bb, value.low);`);
  lines.push(`  writeInt32(bb, value.high);`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function readVarint32(bb${ts('ByteBuffer')})${ts('number')} {`);
  lines.push(`  ${varOrLet} c = 0;`);
  lines.push(`  ${varOrLet} value = 0;`);
  lines.push(`  ${varOrLet} b${ts('number')};`);
  lines.push(`  do {`);
  lines.push(`    b = readByte(bb);`);
  lines.push(`    if (c < 32) value |= (b & 0x7F) << c;`);
  lines.push(`    c += 7;`);
  lines.push(`  } while (b & 0x80);`);
  lines.push(`  return value;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeVarint32(bb${ts('ByteBuffer')}, value${ts('number')})${ts('void')} {`);
  lines.push(`  value >>>= 0;`);
  lines.push(`  while (value >= 0x80) {`);
  lines.push(`    writeByte(bb, (value & 0x7f) | 0x80);`);
  lines.push(`    value >>>= 7;`);
  lines.push(`  }`);
  lines.push(`  writeByte(bb, value);`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function readVarint64(bb${ts('ByteBuffer')}, unsigned${ts('boolean')})${ts('Long')} {`);
  lines.push(`  ${varOrLet} part0 = 0;`);
  lines.push(`  ${varOrLet} part1 = 0;`);
  lines.push(`  ${varOrLet} part2 = 0;`);
  lines.push(`  ${varOrLet} b${ts('number')};`);
  lines.push(``);
  lines.push(`  b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {`);
  lines.push(`    b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {`);
  lines.push(`      b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {`);
  lines.push(`        b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {`);
  lines.push(``);
  lines.push(`          b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {`);
  lines.push(`            b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {`);
  lines.push(`              b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {`);
  lines.push(`                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {`);
  lines.push(``);
  lines.push(`                  b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {`);
  lines.push(`                    b = readByte(bb); part2 |= (b & 0x7F) << 7;`);
  lines.push(`                  }`);
  lines.push(`                }`);
  lines.push(`              }`);
  lines.push(`            }`);
  lines.push(`          }`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  return {`);
  lines.push(`    low: part0 | (part1 << 28),`);
  lines.push(`    high: (part1 >>> 4) | (part2 << 24),`);
  lines.push(`    unsigned,`);
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeVarint64(bb${ts('ByteBuffer')}, value${ts('Long')})${ts('void')} {`);
  lines.push(`  ${varOrLet} part0 = value.low >>> 0;`);
  lines.push(`  ${varOrLet} part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;`);
  lines.push(`  ${varOrLet} part2 = value.high >>> 24;`);
  lines.push(``);
  lines.push(`  // ref: src/google/protobuf/io/coded_stream.cc`);
  lines.push(`  ${varOrLet} size =`);
  lines.push(`    part2 === 0 ?`);
  lines.push(`      part1 === 0 ?`);
  lines.push(`        part0 < 1 << 14 ?`);
  lines.push(`          part0 < 1 << 7 ? 1 : 2 :`);
  lines.push(`          part0 < 1 << 21 ? 3 : 4 :`);
  lines.push(`        part1 < 1 << 14 ?`);
  lines.push(`          part1 < 1 << 7 ? 5 : 6 :`);
  lines.push(`          part1 < 1 << 21 ? 7 : 8 :`);
  lines.push(`      part2 < 1 << 7 ? 9 : 10;`);
  lines.push(``);
  lines.push(`  ${varOrLet} offset = grow(bb, size);`);
  lines.push(`  ${varOrLet} bytes = bb.bytes;`);
  lines.push(``);
  lines.push(`  switch (size) {`);
  lines.push(`    case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;`);
  lines.push(`    case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;`);
  lines.push(`    case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;`);
  lines.push(`    case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;`);
  lines.push(`    case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;`);
  lines.push(`    case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;`);
  lines.push(`    case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;`);
  lines.push(`    case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;`);
  lines.push(`    case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;`);
  lines.push(`    case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function readVarint32ZigZag(bb${ts('ByteBuffer')})${ts('number')} {`);
  lines.push(`  ${varOrLet} value = readVarint32(bb);`);
  lines.push(``);
  lines.push(`  // ref: src/google/protobuf/wire_format_lite.h`);
  lines.push(`  return (value >>> 1) ^ -(value & 1);`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeVarint32ZigZag(bb${ts('ByteBuffer')}, value${ts('number')})${ts('void')} {`);
  lines.push(`  // ref: src/google/protobuf/wire_format_lite.h`);
  lines.push(`  writeVarint32(bb, (value << 1) ^ (value >> 31));`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function readVarint64ZigZag(bb${ts('ByteBuffer')})${ts('Long')} {`);
  lines.push(`  ${varOrLet} value = readVarint64(bb, /* unsigned */ false);`);
  lines.push(`  ${varOrLet} low = value.low;`);
  lines.push(`  ${varOrLet} high = value.high;`);
  lines.push(`  ${varOrLet} flip = -(low & 1);`);
  lines.push(``);
  lines.push(`  // ref: src/google/protobuf/wire_format_lite.h`);
  lines.push(`  return {`);
  lines.push(`    low: ((low >>> 1) | (high << 31)) ^ flip,`);
  lines.push(`    high: (high >>> 1) ^ flip,`);
  lines.push(`    unsigned: false,`);
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeVarint64ZigZag(bb${ts('ByteBuffer')}, value${ts('Long')})${ts('void')} {`);
  lines.push(`  ${varOrLet} low = value.low;`);
  lines.push(`  ${varOrLet} high = value.high;`);
  lines.push(`  ${varOrLet} flip = high >> 31;`);
  lines.push(``);
  lines.push(`  // ref: src/google/protobuf/wire_format_lite.h`);
  lines.push(`  writeVarint64(bb, {`);
  lines.push(`    low: (low << 1) ^ flip,`);
  lines.push(`    high: ((high << 1) | (low >>> 31)) ^ flip,`);
  lines.push(`    unsigned: false,`);
  lines.push(`  });`);
  lines.push(`}`);
  lines.push(``);

  return lines.join('\n');
}
