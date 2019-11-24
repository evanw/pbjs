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

  const protoToType: { [type: string]: string } = {
    bool: 'boolean',
    bytes: 'Uint8Array',

    double: 'number',
    fixed32: 'number',
    float: 'number',
    int32: 'number',
    sfixed32: 'number',
    sint32: 'number',
    uint32: 'number',

    fixed64: 'Long',
    int64: 'Long',
    sfixed64: 'Long',
    sint64: 'Long',
    uint64: 'Long',
  }

  for (const def of schema.messages) {
    if (typescript) {
      lines.push(`export interface ${def.name} {`);

      for (const field of def.fields) {
        let type = protoToType[field.type] || field.type;

        if (field.map !== null) {
          let { from, to } = field.map;
          if (from === 'bool' || from === 'string') from = 'string';
          else if (protoToType[from] === 'number') from = 'number';
          else if (protoToType[from] === 'Long') from = 'string';
          else throw new Error(`The type ${from} cannot be used as a map key`);
          type = `{ [key: ${from}]: ${protoToType[to] || to} }`;
        }

        const required = field.required ? '' : '?';
        const repeated = field.repeated ? '[]' : '';
        lines.push(`  ${field.name}${required}: ${type}${repeated};`);
      }

      lines.push(`}`);
      lines.push(``);
    }

    lines.push(`${codeForFunctionExport('encode' + def.name)}(message${ts(def.name)})${ts('Uint8Array')} {`);
    lines.push(`  ${varOrLet} bb = popByteBuffer();`);
    lines.push(`  _encode${def.name}(message, bb);`);
    lines.push(`  return toUint8Array(bb);`);
    lines.push(`}`);
    lines.push(``);

    lines.push(`function _encode${def.name}(message${ts(def.name)}, bb${ts('ByteBuffer')})${ts('void')} {`);

    function encodeValue(name: string, buffer: string, value: string, nested = 'nested') {
      let type: number;
      let write: string[];

      switch (name) {
        case 'bool': type = TYPE_VAR_INT; write = [`writeByte(${buffer}, ${value} ? 1 : 0)`]; break;
        case 'bytes': type = TYPE_SIZE_N; write = [`writeVarint32(${buffer}, ${value}.length), writeBytes(${buffer}, ${value})`]; break;
        case 'double': type = TYPE_SIZE_8; write = [`writeDouble(${buffer}, ${value})`]; break;
        case 'fixed32': type = TYPE_SIZE_4; write = [`writeInt32(${buffer}, ${value})`]; break;
        case 'fixed64': type = TYPE_SIZE_8; write = [`writeInt64(${buffer}, ${value})`]; break;
        case 'float': type = TYPE_SIZE_4; write = [`writeFloat(${buffer}, ${value})`]; break;
        case 'int32': type = TYPE_VAR_INT; write = [`writeVarint64(${buffer}, intToLong(${value}))`]; break;
        case 'int64': type = TYPE_VAR_INT; write = [`writeVarint64(${buffer}, ${value})`]; break;
        case 'sfixed32': type = TYPE_SIZE_4; write = [`writeInt32(${buffer}, ${value})`]; break;
        case 'sfixed64': type = TYPE_SIZE_8; write = [`writeInt64(${buffer}, ${value})`]; break;
        case 'sint32': type = TYPE_VAR_INT; write = [`writeVarint32ZigZag(${buffer}, ${value})`]; break;
        case 'sint64': type = TYPE_VAR_INT; write = [`writeVarint64ZigZag(${buffer}, ${value})`]; break;
        case 'uint32': type = TYPE_VAR_INT; write = [`writeVarint32(${buffer}, ${value})`]; break;
        case 'uint64': type = TYPE_VAR_INT; write = [`writeVarint64(${buffer}, ${value})`]; break;
        case 'string': type = TYPE_SIZE_N; write = [`writeString(${buffer}, ${value})`]; break;

        default: {
          if (name in enums) {
            type = TYPE_VAR_INT;
            write = [`writeVarint32(${buffer}, ${prefix}encode${name}[${value}])`];
          } else {
            type = TYPE_SIZE_N;
            write = [
              `${varOrLet} ${nested} = popByteBuffer()`,
              `_encode${name}(${value}, ${nested})`,
              `writeVarint32(${buffer}, ${nested}.limit)`,
              `writeByteBuffer(${buffer}, ${nested})`,
              `pushByteBuffer(${nested})`,
            ];
          }
          break;
        }
      }

      return { type, write };
    }

    for (const field of def.fields) {
      const isPacked = field.repeated && field.options.packed !== 'false' && field.type in packableTypes;
      const modifier = field.repeated ? 'repeated ' : field.required ? 'required ' : 'optional ';

      let humanType = field.type;
      if (field.map !== null) humanType += `<${field.map.from}, ${field.map.to}>`;
      lines.push(`  // ${modifier}${humanType} ${field.name} = ${field.tag};`);

      if (field.repeated || field.map !== null) {
        const collection = `${field.repeated ? 'array' : 'map'}$${field.name}`;
        lines.push(`  ${varOrLet} ${collection} = message.${field.name};`);
        lines.push(`  if (${collection} !== undefined) {`);

        if (field.map !== null) {
          let { from, to } = field.map;
          let keyValue = 'key';

          if (from === 'bool') keyValue = 'key === "true"';
          else if (protoToType[from] === 'number') keyValue = '+key';
          else if (protoToType[from] === 'Long') keyValue = 'stringToLong(key)';

          const key = encodeValue(from, 'nested', keyValue, 'nestedKey');
          const value = encodeValue(to, 'nested', 'value', 'nestedValue');

          lines.push(`    for (${varOrLet} key in ${collection}) {`);
          lines.push(`      ${varOrLet} nested = popByteBuffer();`);
          lines.push(`      ${varOrLet} value = ${collection}[key];`);
          lines.push(`      writeVarint32(nested, ${(1 << 3) | key.type});`);
          for (const line of key.write) lines.push(`      ${line};`);
          lines.push(`      writeVarint32(nested, ${(2 << 3) | value.type});`);
          for (const line of value.write) lines.push(`      ${line};`);
          lines.push(`      writeVarint32(bb, ${(field.tag << 3) | TYPE_SIZE_N});`);
          lines.push(`      writeVarint32(bb, nested.offset);`);
          lines.push(`      writeByteBuffer(bb, nested);`);
          lines.push(`      pushByteBuffer(nested);`);
          lines.push(`    }`);
        }

        else if (isPacked) {
          const { write } = encodeValue(field.type, 'packed', 'value');
          lines.push(`    ${varOrLet} packed = popByteBuffer();`);
          if (es6) {
            lines.push(`    for (let value of ${collection}) {`);
          } else {
            lines.push(`    for (var i = 0; i < ${collection}.length; i++) {`);
            lines.push(`      var value = ${collection}[i];`);
          }
          for (const line of write) lines.push(`      ${line};`);
          lines.push(`    }`);
          lines.push(`    writeVarint32(bb, ${(field.tag << 3) | TYPE_SIZE_N});`);
          lines.push(`    writeVarint32(bb, packed.offset);`);
          lines.push(`    writeByteBuffer(bb, packed);`);
          lines.push(`    pushByteBuffer(packed);`);
        }

        else {
          const { type, write } = encodeValue(field.type, 'bb', 'value');
          if (es6) {
            lines.push(`    for (let value of ${collection}) {`);
          } else {
            lines.push(`    for (var i = 0; i < ${collection}.length; i++) {`);
            lines.push(`      var value = ${collection}[i];`);
          }
          lines.push(`      writeVarint32(bb, ${(field.tag << 3) | type});`);
          for (const line of write) lines.push(`      ${line};`);
          lines.push(`    }`);
        }

        lines.push(`  }`);
        lines.push(``);
      }

      else {
        const value = `$${field.name}`;
        const { type, write } = encodeValue(field.type, 'bb', value);
        lines.push(`  ${varOrLet} ${value} = message.${field.name};`);
        lines.push(`  if (${value} !== undefined) {`);
        lines.push(`    writeVarint32(bb, ${(field.tag << 3) | type});`);
        for (const line of write) lines.push(`    ${line};`);
        lines.push(`  }`);
        lines.push(``);
      }
    }

    if (def.fields.length > 0) {
      lines.pop();
    }

    lines.push(es6 ? '}' : '};');
    lines.push(``);

    lines.push(`${codeForFunctionExport('decode' + def.name)}(binary${ts('Uint8Array')})${ts(def.name)} {`);
    lines.push(`  return _decode${def.name}(wrapByteBuffer(binary));`);
    lines.push(`}`);
    lines.push(``);

    lines.push(`function _decode${def.name}(bb${ts('ByteBuffer')})${ts(def.name)} {`);
    lines.push(`  ${varOrLet} message${ts(def.name)} = {}${typescript ? ' as any' : ''};`);
    lines.push(``);
    lines.push(`  end_of_message: while (!isAtEnd(bb)) {`);
    lines.push(`    ${varOrLet} tag = readVarint32(bb);`);
    lines.push(``);
    lines.push(`    switch (tag >>> 3) {`);
    lines.push(`      case 0:`);
    lines.push(`        break end_of_message;`);
    lines.push(``);

    function decodeValue(name: string, limit = 'limit') {
      let read: string;
      let after: string | null = null;

      switch (name) {
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
        case 'string': read = `readString(bb, readVarint32(bb))`; break;
        case 'uint32': read = `readVarint32(bb) >>> 0`; break;
        case 'uint64': read = `readVarint64(bb, /* unsigned */ true)`; break;

        default: {
          if (name in enums) {
            read = `${prefix}decode${name}[readVarint32(bb)]`;
          } else {
            lines.push(`        ${varOrLet} ${limit} = pushTemporaryLength(bb);`);
            read = `_decode${name}(bb)`;
            after = `bb.limit = ${limit}`;
          }
          break;
        }
      }

      return { read, after };
    }

    for (const field of def.fields) {
      const modifier = field.repeated ? 'repeated ' : field.required ? 'required ' : 'optional ';

      let humanType = field.type;
      if (field.map !== null) humanType += `<${field.map.from}, ${field.map.to}>`;
      lines.push(`      // ${modifier}${humanType} ${field.name} = ${field.tag};`);
      lines.push(`      case ${field.tag}: {`);

      if (field.map !== null) {
        const { from, to } = field.map;
        const key = decodeValue(from, 'keyLimit');
        const value = decodeValue(to, 'valueLimit');
        lines.push(`        ${varOrLet} values = message.${field.name} || (message.${field.name} = {});`);
        lines.push(`        ${varOrLet} outerLimit = pushTemporaryLength(bb);`);
        lines.push(`        ${varOrLet} key${ts(`${protoToType[from] || from} | undefined`)};`);
        lines.push(`        ${varOrLet} value${ts(`${protoToType[to] || to} | undefined`)};`);
        lines.push(`        end_of_entry: while (!isAtEnd(bb)) {`);
        lines.push(`          ${varOrLet} tag = readVarint32(bb);`);
        lines.push(`          switch (tag >>> 3) {`);
        lines.push(`            case 0:`);
        lines.push(`              break end_of_entry;`);
        lines.push(`            case 1:`);
        lines.push(`              key = ${key.read};`);
        if (key.after) lines.push(`              ${key.after};`);
        lines.push(`              break;`);
        lines.push(`            case 2:`);
        lines.push(`              value = ${value.read};`);
        if (value.after) lines.push(`              ${value.after};`);
        lines.push(`              break;`);
        lines.push(`            default:`);
        lines.push(`              skipUnknownField(bb, tag & 7);`);
        lines.push(`          }`);
        lines.push(`        }`);
        lines.push(`        if (key === undefined || value === undefined)`);
        lines.push(`          throw new Error(${quote(`Invalid data for map: ${field.name}`)});`);
        if (from === 'bool') lines.push(`        values[key + ''] = value;`);
        else if (protoToType[from] === 'Long') lines.push(`        values[longToString(key)] = value;`);
        else lines.push(`        values[key] = value;`);
        lines.push(`        bb.limit = outerLimit;`);
      }

      else if (field.repeated) {
        const { read, after } = decodeValue(field.type);
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
        const { read, after } = decodeValue(field.type);
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

  lines.push(`function stringToLong(value${ts('string')})${ts('Long')} {`);
  lines.push(`  return {`);
  lines.push(`    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),`);
  lines.push(`    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),`);
  lines.push(`    unsigned: false,`);
  lines.push(`  };`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function longToString(value${ts('Long')})${ts('string')} {`);
  lines.push(`  ${varOrLet} low = value.low;`);
  lines.push(`  ${varOrLet} high = value.high;`);
  lines.push(`  return String.fromCharCode(`);
  lines.push(`    low & 0xFFFF,`);
  lines.push(`    low >>> 16,`);
  lines.push(`    high & 0xFFFF,`);
  lines.push(`    high >>> 16);`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`// The code below was modified from https://github.com/protobufjs/bytebuffer.js`);
  lines.push(`// which is under the Apache License 2.0.`);
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

  lines.push(`${varOrLet} bbStack${ts('ByteBuffer[]')} = [];`);
  lines.push(``);

  lines.push(`function popByteBuffer()${ts('ByteBuffer')} {`);
  lines.push(`  const bb = bbStack.pop();`);
  lines.push(`  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };`);
  lines.push(`  bb.offset = bb.limit = 0;`);
  lines.push(`  return bb;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function pushByteBuffer(bb${ts('ByteBuffer')})${ts('void')} {`);
  lines.push(`  bbStack.push(bb);`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function wrapByteBuffer(bytes${typescript ? ': Uint8Array' : ''})${ts('ByteBuffer')} {`);
  lines.push(`  return { bytes, offset: 0, limit: bytes.length };`);
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

  lines.push(`function readString(bb${ts('ByteBuffer')}, count${ts('number')})${ts('string')} {`);
  lines.push(`  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8`);
  lines.push(`  ${varOrLet} offset = advance(bb, count);`);
  lines.push(`  ${varOrLet} fromCharCode = String.fromCharCode;`);
  lines.push(`  ${varOrLet} bytes = bb.bytes;`);
  lines.push(`  ${varOrLet} invalid = '\\uFFFD';`);
  lines.push(`  ${varOrLet} text = '';`);
  lines.push(``);
  lines.push(`  for (${varOrLet} i = 0; i < count; i++) {`);
  lines.push(`    ${varOrLet} c1 = bytes[i + offset], c2${ts('number')}, c3${ts('number')}, c4${ts('number')}, c${ts('number')};`);
  lines.push(``);
  lines.push(`    // 1 byte`);
  lines.push(`    if ((c1 & 0x80) === 0) {`);
  lines.push(`      text += fromCharCode(c1);`);
  lines.push(`    }`);
  lines.push(``);
  lines.push(`    // 2 bytes`);
  lines.push(`    else if ((c1 & 0xE0) === 0xC0) {`);
  lines.push(`      if (i + 1 >= count) text += invalid;`);
  lines.push(`      else {`);
  lines.push(`        c2 = bytes[i + offset + 1];`);
  lines.push(`        if ((c2 & 0xC0) !== 0x80) text += invalid;`);
  lines.push(`        else {`);
  lines.push(`          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);`);
  lines.push(`          if (c < 0x80) text += invalid;`);
  lines.push(`          else {`);
  lines.push(`            text += fromCharCode(c);`);
  lines.push(`            i++;`);
  lines.push(`          }`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);
  lines.push(``);
  lines.push(`    // 3 bytes`);
  lines.push(`    else if ((c1 & 0xF0) == 0xE0) {`);
  lines.push(`      if (i + 2 >= count) text += invalid;`);
  lines.push(`      else {`);
  lines.push(`        c2 = bytes[i + offset + 1];`);
  lines.push(`        c3 = bytes[i + offset + 2];`);
  lines.push(`        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;`);
  lines.push(`        else {`);
  lines.push(`          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);`);
  lines.push(`          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;`);
  lines.push(`          else {`);
  lines.push(`            text += fromCharCode(c);`);
  lines.push(`            i += 2;`);
  lines.push(`          }`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);
  lines.push(``);
  lines.push(`    // 4 bytes`);
  lines.push(`    else if ((c1 & 0xF8) == 0xF0) {`);
  lines.push(`      if (i + 3 >= count) text += invalid;`);
  lines.push(`      else {`);
  lines.push(`        c2 = bytes[i + offset + 1];`);
  lines.push(`        c3 = bytes[i + offset + 2];`);
  lines.push(`        c4 = bytes[i + offset + 3];`);
  lines.push(`        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;`);
  lines.push(`        else {`);
  lines.push(`          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);`);
  lines.push(`          if (c < 0x10000 || c > 0x10FFFF) text += invalid;`);
  lines.push(`          else {`);
  lines.push(`            c -= 0x10000;`);
  lines.push(`            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);`);
  lines.push(`            i += 3;`);
  lines.push(`          }`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);
  lines.push(``);
  lines.push(`    else text += invalid;`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  return text;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeString(bb${ts('ByteBuffer')}, text${ts('string')})${ts('void')} {`);
  lines.push(`  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8`);
  lines.push(`  ${varOrLet} n = text.length;`);
  lines.push(`  ${varOrLet} byteCount = 0;`);
  lines.push(``);
  lines.push(`  // Write the byte count first`);
  lines.push(`  for (${varOrLet} i = 0; i < n; i++) {`);
  lines.push(`    ${varOrLet} c = text.charCodeAt(i);`);
  lines.push(`    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {`);
  lines.push(`      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;`);
  lines.push(`    }`);
  lines.push(`    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;`);
  lines.push(`  }`);
  lines.push(`  writeVarint32(bb, byteCount);`);
  lines.push(``);
  lines.push(`  ${varOrLet} offset = grow(bb, byteCount);`);
  lines.push(`  ${varOrLet} bytes = bb.bytes;`);
  lines.push(``);
  lines.push(`  // Then write the bytes`);
  lines.push(`  for (${varOrLet} i = 0; i < n; i++) {`);
  lines.push(`    ${varOrLet} c = text.charCodeAt(i);`);
  lines.push(`    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {`);
  lines.push(`      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;`);
  lines.push(`    }`);
  lines.push(`    if (c < 0x80) {`);
  lines.push(`      bytes[offset++] = c;`);
  lines.push(`    } else {`);
  lines.push(`      if (c < 0x800) {`);
  lines.push(`        bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;`);
  lines.push(`      } else {`);
  lines.push(`        if (c < 0x10000) {`);
  lines.push(`          bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;`);
  lines.push(`        } else {`);
  lines.push(`          bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;`);
  lines.push(`          bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;`);
  lines.push(`        }`);
  lines.push(`        bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;`);
  lines.push(`      }`);
  lines.push(`      bytes[offset++] = (c & 0x3F) | 0x80;`);
  lines.push(`    }`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeByteBuffer(bb${ts('ByteBuffer')}, buffer${ts('ByteBuffer')})${ts('void')} {`);
  lines.push(`  ${varOrLet} offset = grow(bb, buffer.limit);`);
  lines.push(`  ${varOrLet} from = bb.bytes;`);
  lines.push(`  ${varOrLet} to = buffer.bytes;`);
  lines.push(``);
  lines.push(`  // This for loop is much faster than subarray+set on V8`);
  lines.push(`  for (${varOrLet} i = 0, n = buffer.limit; i < n; i++) {`);
  lines.push(`    from[i + offset] = to[i];`);
  lines.push(`  }`);
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
  lines.push(`  ${varOrLet} bytes = bb.bytes;`);
  lines.push(``);
  lines.push(`  // Manual copying is much faster than subarray+set in V8`);
  lines.push(`  f32_u8[0] = bytes[offset++];`);
  lines.push(`  f32_u8[1] = bytes[offset++];`);
  lines.push(`  f32_u8[2] = bytes[offset++];`);
  lines.push(`  f32_u8[3] = bytes[offset++];`);
  lines.push(`  return f32[0];`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeFloat(bb${ts('ByteBuffer')}, value${ts('number')})${ts('void')} {`);
  lines.push(`  ${varOrLet} offset = grow(bb, 4);`);
  lines.push(`  ${varOrLet} bytes = bb.bytes;`);
  lines.push(`  f32[0] = value;`);
  lines.push(``);
  lines.push(`  // Manual copying is much faster than subarray+set in V8`);
  lines.push(`  bytes[offset++] = f32_u8[0];`);
  lines.push(`  bytes[offset++] = f32_u8[1];`);
  lines.push(`  bytes[offset++] = f32_u8[2];`);
  lines.push(`  bytes[offset++] = f32_u8[3];`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function readDouble(bb${ts('ByteBuffer')})${ts('number')} {`);
  lines.push(`  ${varOrLet} offset = advance(bb, 8);`);
  lines.push(`  ${varOrLet} bytes = bb.bytes;`);
  lines.push(``);
  lines.push(`  // Manual copying is much faster than subarray+set in V8`);
  lines.push(`  f64_u8[0] = bytes[offset++];`);
  lines.push(`  f64_u8[1] = bytes[offset++];`);
  lines.push(`  f64_u8[2] = bytes[offset++];`);
  lines.push(`  f64_u8[3] = bytes[offset++];`);
  lines.push(`  f64_u8[4] = bytes[offset++];`);
  lines.push(`  f64_u8[5] = bytes[offset++];`);
  lines.push(`  f64_u8[6] = bytes[offset++];`);
  lines.push(`  f64_u8[7] = bytes[offset++];`);
  lines.push(`  return f64[0];`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function writeDouble(bb${ts('ByteBuffer')}, value${ts('number')})${ts('void')} {`);
  lines.push(`  ${varOrLet} offset = grow(bb, 8);`);
  lines.push(`  ${varOrLet} bytes = bb.bytes;`);
  lines.push(`  f64[0] = value;`);
  lines.push(``);
  lines.push(`  // Manual copying is much faster than subarray+set in V8`);
  lines.push(`  bytes[offset++] = f64_u8[0];`);
  lines.push(`  bytes[offset++] = f64_u8[1];`);
  lines.push(`  bytes[offset++] = f64_u8[2];`);
  lines.push(`  bytes[offset++] = f64_u8[3];`);
  lines.push(`  bytes[offset++] = f64_u8[4];`);
  lines.push(`  bytes[offset++] = f64_u8[5];`);
  lines.push(`  bytes[offset++] = f64_u8[6];`);
  lines.push(`  bytes[offset++] = f64_u8[7];`);
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
