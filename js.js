function quote(text) {
  return JSON.stringify(text, null, 2).replace(/\n/g, '\n  ');
}

exports.generate = function(schema) {
  var package = schema.package;
  var enums = {};
  var lines = [];

  var packableTypes = {
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

  var TYPE_VAR_INT = 0;
  var TYPE_SIZE_8 = 1;
  var TYPE_SIZE_N = 2;
  var TYPE_SIZE_4 = 5;

  if (package) {
    lines.push('var ' + package + ' = ' + package + ' || exports || {}, exports;');
  } else {
    package = 'exports';
    lines.push('var exports = exports || {};');
  }

  lines.push('var ByteBuffer = ByteBuffer || require("bytebuffer");');
  lines.push(package + '.Long = ByteBuffer.Long;');
  lines.push('');
  lines.push('(function(undefined) {');
  lines.push('');

  lines.push('  function pushTemporaryLength(buffer) {');
  lines.push('    var length = buffer.readVarint32();');
  lines.push('    var limit = buffer.limit;');
  lines.push('    buffer.limit = buffer.offset + length;');
  lines.push('    return limit;');
  lines.push('  }');
  lines.push('');

  lines.push('  function skipUnknownField(buffer, type) {');
  lines.push('    switch (type) {');
  lines.push('      case ' + TYPE_VAR_INT + ': while (buffer.readByte() & 0x80) {} break;');
  lines.push('      case ' + TYPE_SIZE_N + ': buffer.skip(buffer.readVarint32()); break;');
  lines.push('      case ' + TYPE_SIZE_4 + ': buffer.skip(4); break;');
  lines.push('      case ' + TYPE_SIZE_8 + ': buffer.skip(8); break;');
  lines.push('      default: throw new Error("Unimplemented type: " + type);');
  lines.push('    }');
  lines.push('  }');
  lines.push('');

  lines.push('  function coerceLong(value) {');
  lines.push('    if (!(value instanceof ByteBuffer.Long) && "low" in value && "high" in value)');
  lines.push('      value = new ByteBuffer.Long(value.low, value.high, value.unsigned);');
  lines.push('    return value;');
  lines.push('  }');
  lines.push('');

  for (var i = 0; i < schema.enums.length; i++) {
    var def = schema.enums[i];
    var prefix = def.name + '_';
    var encode = {};
    var decode = {};

    Object.keys(def.values).forEach(function(key) {
      var value = def.values[key];

      // Protocol buffers made the stupid decision to use C-style enum scoping
      // rules. Attempt to fix this by stripping the "EnumType_" prefix if present.
      if (key.slice(0, prefix.length) === prefix) {
        key = key.slice(prefix.length);
      }

      encode[key] = value.value;
      decode[value.value] = key;
    });

    lines.push('  ' + package + '[' + quote('encode' + def.name) + '] = ' + quote(encode) + ';');
    lines.push('');

    lines.push('  ' + package + '[' + quote('decode' + def.name) + '] = ' + quote(decode) + ';');
    lines.push('');

    enums[def.name] = true;
    packableTypes[def.name] = true;
  }

  // Validate the "packed" option once
  for (var i = 0; i < schema.messages.length; i++) {
    var def = schema.messages[i];
    for (var j = 0; j < def.fields.length; j++) {
      var field = def.fields[j];
      if (field.options.packed === 'true' && (!field.repeated || !(field.type in packableTypes))) {
        throw new Error(field.name + ': [packed = true] can only be specified for repeated primitive fields');
      }
    }
  }

  for (var i = 0; i < schema.messages.length; i++) {
    var def = schema.messages[i];

    lines.push('  ' + package + '[' + quote('encode' + def.name) + '] = function(message) {');
    lines.push('    var buffer = new ByteBuffer(undefined, true);');
    lines.push('');

    for (var j = 0; j < def.fields.length; j++) {
      var field = def.fields[j];
      var isPacked = field.repeated && field.options.packed !== 'false' && field.type in packableTypes;
      var buffer = isPacked ? 'packed' : 'buffer';
      var type = 0;
      var write = null;
      var before = null;

      lines.push('    // ' +
        (field.repeated ? 'repeated ' : field.required ? 'required ' : 'optional ') +
        field.type + ' ' + field.name + ' = ' + field.tag + ';');

      switch (field.type) {
        case 'bool': type = TYPE_VAR_INT; write = buffer + '.writeByte(value ? 1 : 0)'; break;
        case 'bytes': type = TYPE_SIZE_N; write = buffer + '.writeVarint32(value.length), ' + buffer + '.append(value)'; break;
        case 'double': type = TYPE_SIZE_8; write = buffer + '.writeDouble(value)'; break;
        case 'fixed32': type = TYPE_SIZE_4; write = buffer + '.writeUint32(value)'; break;
        case 'fixed64': type = TYPE_SIZE_8; write = buffer + '.writeUint64(coerceLong(value))'; break;
        case 'float': type = TYPE_SIZE_4; write = buffer + '.writeFloat(value)'; break;
        case 'int32': type = TYPE_VAR_INT; write = buffer + '.writeVarint64(value | 0)'; break;
        case 'int64': type = TYPE_VAR_INT; write = buffer + '.writeVarint64(coerceLong(value))'; break;
        case 'sfixed32': type = TYPE_SIZE_4; write = buffer + '.writeInt32(value)'; break;
        case 'sfixed64': type = TYPE_SIZE_8; write = buffer + '.writeInt64(coerceLong(value))'; break;
        case 'sint32': type = TYPE_VAR_INT; write = buffer + '.writeVarint32ZigZag(value)'; break;
        case 'sint64': type = TYPE_VAR_INT; write = buffer + '.writeVarint64ZigZag(coerceLong(value))'; break;
        case 'uint32': type = TYPE_VAR_INT; write = buffer + '.writeVarint32(value)'; break;
        case 'uint64': type = TYPE_VAR_INT; write = buffer + '.writeVarint64(coerceLong(value))'; break;

        case 'string': {
          type = TYPE_SIZE_N;
          before = 'var nested = new ByteBuffer(undefined, true)';
          write = 'nested.writeUTF8String(value), ' + buffer + '.writeVarint32(nested.flip().limit), ' + buffer + '.append(nested)';
          break;
        }

        default: {
          if (field.type in enums) {
            type = TYPE_VAR_INT;
            write = buffer + '.writeVarint32(' + package + '[' + quote('encode' + field.type) + '][value])';
          } else {
            type = TYPE_SIZE_N;
            before = 'var nested = ' + package + '[' + quote('encode' + field.type) + '](value)';
            write = buffer + '.writeVarint32(nested.byteLength), ' + buffer + '.append(nested)';
          }
          break;
        }
      }

      if (field.repeated) {
        lines.push('    var values = message[' + quote(field.name) + '];');
        lines.push('    if (values !== undefined) {');

        if (isPacked) {
          lines.push('      var packed = new ByteBuffer(undefined, true)');
          lines.push('      for (var i = 0; i < values.length; i++) {');
          lines.push('        var value = values[i];');
          if (before) lines.push('        ' + before + ';');
          lines.push('        ' + write + ';');
          lines.push('      }');
          lines.push('      buffer.writeVarint32(' + ((field.tag << 3) | TYPE_SIZE_N) + ');');
          lines.push('      buffer.writeVarint32(packed.flip().limit);');
          lines.push('      buffer.append(packed);');
        }

        else {
          lines.push('      for (var i = 0; i < values.length; i++) {');
          lines.push('        var value = values[i];');
          if (before) lines.push('        ' + before + ';');
          lines.push('        buffer.writeVarint32(' + ((field.tag << 3) | type) + ');');
          lines.push('        ' + write + ';');
          lines.push('      }');
        }

        lines.push('    }');
        lines.push('');
      }

      else {
        lines.push('    var value = message[' + quote(field.name) + '];');
        lines.push('    if (value !== undefined) {');
        lines.push('      buffer.writeVarint32(' + ((field.tag << 3) | type) + ');');
        if (before) lines.push('      ' + before + ';');
        lines.push('      ' + write + ';');
        lines.push('    }');
        lines.push('');
      }
    }

    lines.push('    return buffer.flip().toBuffer();');
    lines.push('  };');
    lines.push('');

    lines.push('  ' + package + '[' + quote('decode' + def.name) + '] = function(buffer) {');
    lines.push('    var message = {};');
    lines.push('');
    lines.push('    if (!(buffer instanceof ByteBuffer))');
    lines.push('      buffer = new ByteBuffer.fromBinary(buffer, true);');
    lines.push('');
    lines.push('    end_of_message: while (buffer.remaining() > 0) {');
    lines.push('      var tag = buffer.readVarint32();');
    lines.push('');
    lines.push('      switch (tag >>> 3) {');
    lines.push('      case 0:');
    lines.push('        break end_of_message;');
    lines.push('');

    for (var j = 0; j < def.fields.length; j++) {
      var field = def.fields[j];
      var isPacked = field.repeated && field.options.packed !== 'false' && field.type in packableTypes;
      var read = null;
      var after = null;

      lines.push('      // ' +
        (field.repeated ? 'repeated ' : field.required ? 'required ' : 'optional ') +
        field.type + ' ' + field.name + ' = ' + field.tag + ';');
      lines.push('      case ' + field.tag + ':');

      switch (field.type) {
        case 'bool': read = '!!buffer.readByte()'; break;
        case 'bytes': read = 'buffer.readBytes(buffer.readVarint32()).toBuffer()'; break;
        case 'double': read = 'buffer.readDouble()'; break;
        case 'fixed32': read = 'buffer.readUint32()'; break;
        case 'fixed64': read = 'buffer.readUint64()'; break;
        case 'float': read = 'buffer.readFloat()'; break;
        case 'int32': read = 'buffer.readVarint32()'; break;
        case 'int64': read = 'buffer.readVarint64()'; break;
        case 'sfixed32': read = 'buffer.readInt32()'; break;
        case 'sfixed64': read = 'buffer.readInt64()'; break;
        case 'sint32': read = 'buffer.readVarint32ZigZag()'; break;
        case 'sint64': read = 'buffer.readVarint64ZigZag()'; break;
        case 'string': read = 'buffer.readUTF8String(buffer.readVarint32(), "b")'; break;
        case 'uint32': read = 'buffer.readVarint32() >>> 0'; break;
        case 'uint64': read = 'buffer.readVarint64().toUnsigned()'; break;

        default: {
          if (field.type in enums) {
            read = package + '[' + quote('decode' + field.type) + '][buffer.readVarint32()]';
          } else {
            lines.push('        var limit = pushTemporaryLength(buffer);');
            read = package + '[' + quote('decode' + field.type) + '](buffer)';
            after = 'buffer.limit = limit';
          }
          break;
        }
      }

      if (field.repeated) {
        lines.push('        var values = message[' + quote(field.name) + '] || (message[' + quote(field.name) + '] = []);');

        // Support both packed and unpacked encodings for primitive types
        if (field.type in packableTypes) {
          lines.push('        if ((tag & 7) === ' + TYPE_SIZE_N + ') {');
          lines.push('          var outerLimit = pushTemporaryLength(buffer);');
          lines.push('          while (buffer.remaining() > 0) {');
          lines.push('            values.push(' + read + ');');
          if (after) lines.push('            ' + after + ';');
          lines.push('          }');
          lines.push('          buffer.limit = outerLimit;');
          lines.push('        } else {');
          lines.push('          values.push(' + read + ');');
          if (after) lines.push('          ' + after + ';');
          lines.push('        }');
        }

        else {
          lines.push('        values.push(' + read + ');');
          if (after) lines.push('        ' + after + ';');
        }
      }

      else {
        lines.push('        message[' + quote(field.name) + '] = ' + read + ';');
        if (after) lines.push('        ' + after + ';');
      }

      lines.push('        break;');
      lines.push('');
    }

    lines.push('      default:');
    lines.push('        skipUnknownField(buffer, tag & 7);');
    lines.push('      }');
    lines.push('    }');
    lines.push('');

    for (var j = 0; j < def.fields.length; j++) {
      var field = def.fields[j];

      if (field.required) {
        lines.push('    if (message[' + quote(field.name) + '] === undefined)');
        lines.push('      throw new Error(' + quote('Missing required field: ' + field.name) + ');');
        lines.push('');
      }
    }

    lines.push('    return message;');
    lines.push('  };');
    lines.push('');
  }

  lines.push('})();');
  lines.push('');

  return lines.join('\n');
};
