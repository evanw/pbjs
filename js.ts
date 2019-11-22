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
  let pkg = schema.package;
  const typescript = !!options.typescript;
  const es6 = typescript || !!options.es6;
  const varOrConst = es6 ? 'const' : 'var';
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

  if (es6) {
    lines.push(`import * as ByteBuffer from "bytebuffer";`);
    if (typescript) lines.push(`import * as Long from "long";`);
    lines.push(``);
  }

  else {
    if (pkg) {
      lines.push(`var ${pkg} = ${pkg} || exports || {}, exports;`);
    } else {
      pkg = 'exports';
      lines.push(`var exports = exports || {};`);
    }

    lines.push(`var ByteBuffer = ByteBuffer || require("bytebuffer");`);
    lines.push(pkg + '.Long = ByteBuffer.Long;');
    lines.push(``);
    lines.push(`(function(undefined) {`);
    lines.push(``);
  }

  const prefix = es6 ? '' : pkg + '.';

  lines.push(`function pushTemporaryLength(buffer${ts('ByteBuffer')})${ts('number')} {`);
  lines.push(`  ${varOrConst} length = buffer.readVarint32();`);
  lines.push(`  ${varOrConst} limit = buffer.limit;`);
  lines.push(`  buffer.limit = buffer.offset + length;`);
  lines.push(`  return limit;`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function skipUnknownField(buffer${ts('ByteBuffer')}, type${ts('number')})${ts('void')} {`);
  lines.push(`  switch (type) {`);
  lines.push(`    case ${TYPE_VAR_INT}: while (buffer.readByte() & 0x80) {} break;`);
  lines.push(`    case ${TYPE_SIZE_N}: buffer.skip(buffer.readVarint32()); break;`);
  lines.push(`    case ${TYPE_SIZE_4}: buffer.skip(4); break;`);
  lines.push(`    case ${TYPE_SIZE_8}: buffer.skip(8); break;`);
  lines.push(`    default: throw new Error("Unimplemented type: " + type);`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);

  lines.push(`function coerceLong(value${ts('any')})${ts('Long')} {`);
  lines.push(`  if (!(value instanceof ${typescript ? '' : 'ByteBuffer.'}Long) && "low" in value && "high" in value)`);
  lines.push(`    value = new ${typescript ? '' : 'ByteBuffer.'}Long(value.low, value.high, value.unsigned);`);
  lines.push(`  return value;`);
  lines.push(`}`);
  lines.push(``);

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
      lines.push(`export enum ${def.name} {`);
      lines.push.apply(lines, items);
      lines.push(`}`);
      lines.push(``);
    }

    lines.push(`${codeForEnumExport('encode' + def.name)}${ts(`{[key: string]: number}`)} = {`);
    lines.push.apply(lines, encode);
    lines.push(`};`);
    lines.push('');

    lines.push(`${codeForEnumExport('decode' + def.name)}${ts(`{[key: number]: ${def.name}}`)} = {`);
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
    return es6 ? `export function ${name}` : `${pkg}.${name} = function`;
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
    lines.push(`  ${varOrConst} buffer = new ByteBuffer(undefined, /* isLittleEndian */ true);`);
    lines.push(``);

    for (const field of def.fields) {
      const isPacked = field.repeated && field.options.packed !== 'false' && field.type in packableTypes;
      const buffer = isPacked ? 'packed' : 'buffer';
      const modifier = field.repeated ? 'repeated ' : field.required ? 'required ' : 'optional ';
      const value = `$${field.name}`;
      let type = 0;
      let write = null;
      let before = null;

      lines.push(`  // ${modifier}${field.type} ${field.name} = ${field.tag};`);

      switch (field.type) {
        case 'bool': type = TYPE_VAR_INT; write = `${buffer}.writeByte(${value} ? 1 : 0)`; break;
        case 'bytes': type = TYPE_SIZE_N; write = `${buffer}.writeVarint32(${value}.length), ${buffer}.append(${value})`; break;
        case 'double': type = TYPE_SIZE_8; write = `${buffer}.writeDouble(${value})`; break;
        case 'fixed32': type = TYPE_SIZE_4; write = `${buffer}.writeUint32(${value})`; break;
        case 'fixed64': type = TYPE_SIZE_8; write = `${buffer}.writeUint64(coerceLong(${value}))`; break;
        case 'float': type = TYPE_SIZE_4; write = `${buffer}.writeFloat(${value})`; break;
        case 'int32': type = TYPE_VAR_INT; write = `${buffer}.writeVarint64(${value} | 0)`; break;
        case 'int64': type = TYPE_VAR_INT; write = `${buffer}.writeVarint64(coerceLong(${value}))`; break;
        case 'sfixed32': type = TYPE_SIZE_4; write = `${buffer}.writeInt32(${value})`; break;
        case 'sfixed64': type = TYPE_SIZE_8; write = `${buffer}.writeInt64(coerceLong(${value}))`; break;
        case 'sint32': type = TYPE_VAR_INT; write = `${buffer}.writeVarint32ZigZag(${value})`; break;
        case 'sint64': type = TYPE_VAR_INT; write = `${buffer}.writeVarint64ZigZag(coerceLong(${value}))`; break;
        case 'uint32': type = TYPE_VAR_INT; write = `${buffer}.writeVarint32(${value})`; break;
        case 'uint64': type = TYPE_VAR_INT; write = `${buffer}.writeVarint64(coerceLong(${value}))`; break;

        case 'string': {
          type = TYPE_SIZE_N;
          before = `${varOrConst} nested = new ByteBuffer(undefined, /* isLittleEndian */ true)`;
          write = `nested.writeUTF8String(${value}), ${buffer}.writeVarint32(nested.flip().limit), ${buffer}.append(nested)`;
          break;
        }

        default: {
          if (field.type in enums) {
            type = TYPE_VAR_INT;
            write = `${buffer}.writeVarint32(${prefix}encode${field.type}[${value}])`;
          } else {
            type = TYPE_SIZE_N;
            before = `${varOrConst} nested = ${prefix}encode${field.type}(${value})`;
            write = `${buffer}.writeVarint32(nested.byteLength), ${buffer}.append(nested)`;
          }
          break;
        }
      }

      if (field.repeated) {
        const array = `array$${field.name}`;
        lines.push(`  ${varOrConst} ${array} = message.${field.name};`);
        lines.push(`  if (${array} !== undefined) {`);

        if (isPacked) {
          lines.push(`    ${varOrConst} packed = new ByteBuffer(undefined, /* isLittleEndian */ true);`);
          if (es6) {
            lines.push(`    for (const ${value} of ${array}) {`);
          } else {
            lines.push(`    for (var i = 0; i < ${array}.length; i++) {`);
            lines.push(`      var ${value} = ${array}[i];`);
          }
          if (before) lines.push(`      ${before};`);
          lines.push(`      ${write};`);
          lines.push(`    }`);
          lines.push(`    buffer.writeVarint32(${(field.tag << 3) | TYPE_SIZE_N});`);
          lines.push(`    buffer.writeVarint32(packed.flip().limit);`);
          lines.push(`    buffer.append(packed);`);
        }

        else {
          if (es6) {
            lines.push(`    for (const ${value} of ${array}) {`);
          } else {
            lines.push(`    for (var i = 0; i < ${array}.length; i++) {`);
            lines.push(`      var ${value} = ${array}[i];`);
          }
          if (before) lines.push(`      ${before};`);
          lines.push(`      buffer.writeVarint32(${(field.tag << 3) | type});`);
          lines.push(`      ${write};`);
          lines.push(`    }`);
        }

        lines.push(`  }`);
        lines.push(``);
      }

      else {
        lines.push(`  ${varOrConst} ${value} = message.${field.name};`);
        lines.push(`  if (${value} !== undefined) {`);
        lines.push(`    buffer.writeVarint32(${(field.tag << 3) | type});`);
        if (before) lines.push(`    ${before};`);
        lines.push(`    ${write};`);
        lines.push(`  }`);
        lines.push(``);
      }
    }

    lines.push(`  return buffer.flip().toBuffer();`);
    lines.push(es6 ? '}' : '};');
    lines.push(``);

    lines.push(`${codeForFunctionExport('decode' + def.name)}(binary${ts('ByteBuffer | Uint8Array | ArrayBuffer')})${ts(def.name)} {`);
    lines.push(`  ${varOrConst} message${ts(def.name)} = {}${typescript ? ' as any' : ''};`);
    lines.push(`  ${varOrConst} buffer = binary instanceof ByteBuffer ? binary : ByteBuffer.wrap(binary, /* isLittleEndian */ true);`);
    lines.push(``);
    lines.push(`  end_of_message: while (buffer.remaining() > 0) {`);
    lines.push(`    ${varOrConst} tag = buffer.readVarint32();`);
    lines.push(``);
    lines.push(`    switch (tag >>> 3) {`);
    lines.push(`    case 0:`);
    lines.push(`      break end_of_message;`);
    lines.push(``);

    for (const field of def.fields) {
      const modifier = field.repeated ? 'repeated ' : field.required ? 'required ' : 'optional ';
      let read = null;
      let after = null;

      lines.push(`    // ${modifier}${field.type} ${field.name} = ${field.tag};`);
      lines.push(`    case ${field.tag}: {`);

      switch (field.type) {
        case 'bool': read = `!!buffer.readByte()`; break;
        case 'bytes': read = `buffer.readBytes(buffer.readVarint32()).toBuffer()`; break;
        case 'double': read = `buffer.readDouble()`; break;
        case 'fixed32': read = `buffer.readUint32()`; break;
        case 'fixed64': read = `buffer.readUint64()`; break;
        case 'float': read = `buffer.readFloat()`; break;
        case 'int32': read = `buffer.readVarint32()`; break;
        case 'int64': read = `buffer.readVarint64()`; break;
        case 'sfixed32': read = `buffer.readInt32()`; break;
        case 'sfixed64': read = `buffer.readInt64()`; break;
        case 'sint32': read = `buffer.readVarint32ZigZag()`; break;
        case 'sint64': read = `buffer.readVarint64ZigZag()`; break;
        case 'string': read = `buffer.readUTF8String(buffer.readVarint32(), ByteBuffer.METRICS_BYTES)${typescript ? ' as string' : ''}`; break;
        case 'uint32': read = `buffer.readVarint32() >>> 0`; break;
        case 'uint64': read = `buffer.readVarint64().toUnsigned()`; break;

        default: {
          if (field.type in enums) {
            read = `${prefix}decode${field.type}[buffer.readVarint32()]`;
          } else {
            lines.push(`      ${varOrConst} limit = pushTemporaryLength(buffer);`);
            read = `${prefix}decode${field.type}(buffer)`;
            after = 'buffer.limit = limit';
          }
          break;
        }
      }

      if (field.repeated) {
        lines.push(`      ${varOrConst} values = message.${field.name} || (message.${field.name} = []);`);

        // Support both packed and unpacked encodings for primitive types
        if (field.type in packableTypes) {
          lines.push(`      if ((tag & 7) === ${TYPE_SIZE_N}) {`);
          lines.push(`        ${varOrConst} outerLimit = pushTemporaryLength(buffer);`);
          lines.push(`        while (buffer.remaining() > 0) {`);
          lines.push(`          values.push(${read});`);
          if (after) lines.push(`          ${after};`);
          lines.push(`        }`);
          lines.push(`        buffer.limit = outerLimit;`);
          lines.push(`      } else {`);
          lines.push(`        values.push(${read});`);
          if (after) lines.push(`        ${after};`);
          lines.push(`      }`);
        }

        else {
          lines.push(`      values.push(${read});`);
          if (after) lines.push(`      ${after};`);
        }
      }

      else {
        lines.push(`      message.${field.name} = ${read};`);
        if (after) lines.push(`      ${after};`);
      }

      lines.push(`      break;`);
      lines.push(`    }`);
      lines.push(``);
    }

    lines.push(`    default:`);
    lines.push(`      skipUnknownField(buffer, tag & 7);`);
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

  if (!es6) {
    lines.push(`})();`);
    lines.push(``);
  }

  return lines.join('\n');
}
