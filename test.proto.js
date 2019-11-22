var test = test || exports || {}, exports;
var ByteBuffer = ByteBuffer || require("bytebuffer");
test.Long = ByteBuffer.Long;

(function(undefined) {

function pushTemporaryLength(buffer) {
  var length = buffer.readVarint32();
  var limit = buffer.limit;
  buffer.limit = buffer.offset + length;
  return limit;
}

function skipUnknownField(buffer, type) {
  switch (type) {
    case 0: while (buffer.readByte() & 0x80) {} break;
    case 2: buffer.skip(buffer.readVarint32()); break;
    case 5: buffer.skip(4); break;
    case 1: buffer.skip(8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

function coerceLong(value) {
  if (!(value instanceof ByteBuffer.Long) && "low" in value && "high" in value)
    value = new ByteBuffer.Long(value.low, value.high, value.unsigned);
  return value;
}

test.encodeEnum = {
  A: 0,
  B: 1,
};

test.decodeEnum = {
  0: "A",
  1: "B",
};

test.encodeNested = function(message) {
  var buffer = new ByteBuffer(undefined, /* isLittleEndian */ true);

  // optional float x = 1;
  var $x = message.x;
  if ($x !== undefined) {
    buffer.writeVarint32(13);
    buffer.writeFloat($x);
  }

  // optional float y = 2;
  var $y = message.y;
  if ($y !== undefined) {
    buffer.writeVarint32(21);
    buffer.writeFloat($y);
  }

  return buffer.flip().toBuffer();
};

test.decodeNested = function(binary) {
  var message = {};
  var buffer = binary instanceof ByteBuffer ? binary : ByteBuffer.wrap(binary, /* isLittleEndian */ true);

  end_of_message: while (buffer.remaining() > 0) {
    var tag = buffer.readVarint32();

    switch (tag >>> 3) {
    case 0:
      break end_of_message;

    // optional float x = 1;
    case 1: {
      message.x = buffer.readFloat();
      break;
    }

    // optional float y = 2;
    case 2: {
      message.y = buffer.readFloat();
      break;
    }

    default:
      skipUnknownField(buffer, tag & 7);
    }
  }

  return message;
};

test.encodeOptional = function(message) {
  var buffer = new ByteBuffer(undefined, /* isLittleEndian */ true);

  // optional int32 field_int32 = 1;
  var $field_int32 = message.field_int32;
  if ($field_int32 !== undefined) {
    buffer.writeVarint32(8);
    buffer.writeVarint64($field_int32 | 0);
  }

  // optional int64 field_int64 = 2;
  var $field_int64 = message.field_int64;
  if ($field_int64 !== undefined) {
    buffer.writeVarint32(16);
    buffer.writeVarint64(coerceLong($field_int64));
  }

  // optional uint32 field_uint32 = 3;
  var $field_uint32 = message.field_uint32;
  if ($field_uint32 !== undefined) {
    buffer.writeVarint32(24);
    buffer.writeVarint32($field_uint32);
  }

  // optional uint64 field_uint64 = 4;
  var $field_uint64 = message.field_uint64;
  if ($field_uint64 !== undefined) {
    buffer.writeVarint32(32);
    buffer.writeVarint64(coerceLong($field_uint64));
  }

  // optional sint32 field_sint32 = 5;
  var $field_sint32 = message.field_sint32;
  if ($field_sint32 !== undefined) {
    buffer.writeVarint32(40);
    buffer.writeVarint32ZigZag($field_sint32);
  }

  // optional sint64 field_sint64 = 6;
  var $field_sint64 = message.field_sint64;
  if ($field_sint64 !== undefined) {
    buffer.writeVarint32(48);
    buffer.writeVarint64ZigZag(coerceLong($field_sint64));
  }

  // optional bool field_bool = 7;
  var $field_bool = message.field_bool;
  if ($field_bool !== undefined) {
    buffer.writeVarint32(56);
    buffer.writeByte($field_bool ? 1 : 0);
  }

  // optional fixed64 field_fixed64 = 8;
  var $field_fixed64 = message.field_fixed64;
  if ($field_fixed64 !== undefined) {
    buffer.writeVarint32(65);
    buffer.writeUint64(coerceLong($field_fixed64));
  }

  // optional sfixed64 field_sfixed64 = 9;
  var $field_sfixed64 = message.field_sfixed64;
  if ($field_sfixed64 !== undefined) {
    buffer.writeVarint32(73);
    buffer.writeInt64(coerceLong($field_sfixed64));
  }

  // optional double field_double = 10;
  var $field_double = message.field_double;
  if ($field_double !== undefined) {
    buffer.writeVarint32(81);
    buffer.writeDouble($field_double);
  }

  // optional string field_string = 11;
  var $field_string = message.field_string;
  if ($field_string !== undefined) {
    buffer.writeVarint32(90);
    var nested = new ByteBuffer(undefined, /* isLittleEndian */ true);
    nested.writeUTF8String($field_string), buffer.writeVarint32(nested.flip().limit), buffer.append(nested);
  }

  // optional bytes field_bytes = 12;
  var $field_bytes = message.field_bytes;
  if ($field_bytes !== undefined) {
    buffer.writeVarint32(98);
    buffer.writeVarint32($field_bytes.length), buffer.append($field_bytes);
  }

  // optional fixed32 field_fixed32 = 13;
  var $field_fixed32 = message.field_fixed32;
  if ($field_fixed32 !== undefined) {
    buffer.writeVarint32(109);
    buffer.writeUint32($field_fixed32);
  }

  // optional sfixed32 field_sfixed32 = 14;
  var $field_sfixed32 = message.field_sfixed32;
  if ($field_sfixed32 !== undefined) {
    buffer.writeVarint32(117);
    buffer.writeInt32($field_sfixed32);
  }

  // optional float field_float = 15;
  var $field_float = message.field_float;
  if ($field_float !== undefined) {
    buffer.writeVarint32(125);
    buffer.writeFloat($field_float);
  }

  // optional Nested field_nested = 16;
  var $field_nested = message.field_nested;
  if ($field_nested !== undefined) {
    buffer.writeVarint32(130);
    var nested = test.encodeNested($field_nested);
    buffer.writeVarint32(nested.byteLength), buffer.append(nested);
  }

  return buffer.flip().toBuffer();
};

test.decodeOptional = function(binary) {
  var message = {};
  var buffer = binary instanceof ByteBuffer ? binary : ByteBuffer.wrap(binary, /* isLittleEndian */ true);

  end_of_message: while (buffer.remaining() > 0) {
    var tag = buffer.readVarint32();

    switch (tag >>> 3) {
    case 0:
      break end_of_message;

    // optional int32 field_int32 = 1;
    case 1: {
      message.field_int32 = buffer.readVarint32();
      break;
    }

    // optional int64 field_int64 = 2;
    case 2: {
      message.field_int64 = buffer.readVarint64();
      break;
    }

    // optional uint32 field_uint32 = 3;
    case 3: {
      message.field_uint32 = buffer.readVarint32() >>> 0;
      break;
    }

    // optional uint64 field_uint64 = 4;
    case 4: {
      message.field_uint64 = buffer.readVarint64().toUnsigned();
      break;
    }

    // optional sint32 field_sint32 = 5;
    case 5: {
      message.field_sint32 = buffer.readVarint32ZigZag();
      break;
    }

    // optional sint64 field_sint64 = 6;
    case 6: {
      message.field_sint64 = buffer.readVarint64ZigZag();
      break;
    }

    // optional bool field_bool = 7;
    case 7: {
      message.field_bool = !!buffer.readByte();
      break;
    }

    // optional fixed64 field_fixed64 = 8;
    case 8: {
      message.field_fixed64 = buffer.readUint64();
      break;
    }

    // optional sfixed64 field_sfixed64 = 9;
    case 9: {
      message.field_sfixed64 = buffer.readInt64();
      break;
    }

    // optional double field_double = 10;
    case 10: {
      message.field_double = buffer.readDouble();
      break;
    }

    // optional string field_string = 11;
    case 11: {
      message.field_string = buffer.readUTF8String(buffer.readVarint32(), ByteBuffer.METRICS_BYTES);
      break;
    }

    // optional bytes field_bytes = 12;
    case 12: {
      message.field_bytes = buffer.readBytes(buffer.readVarint32()).toBuffer();
      break;
    }

    // optional fixed32 field_fixed32 = 13;
    case 13: {
      message.field_fixed32 = buffer.readUint32();
      break;
    }

    // optional sfixed32 field_sfixed32 = 14;
    case 14: {
      message.field_sfixed32 = buffer.readInt32();
      break;
    }

    // optional float field_float = 15;
    case 15: {
      message.field_float = buffer.readFloat();
      break;
    }

    // optional Nested field_nested = 16;
    case 16: {
      var limit = pushTemporaryLength(buffer);
      message.field_nested = test.decodeNested(buffer);
      buffer.limit = limit;
      break;
    }

    default:
      skipUnknownField(buffer, tag & 7);
    }
  }

  return message;
};

test.encodeRepeatedUnpacked = function(message) {
  var buffer = new ByteBuffer(undefined, /* isLittleEndian */ true);

  // repeated int32 field_int32 = 1;
  var array$field_int32 = message.field_int32;
  if (array$field_int32 !== undefined) {
    for (var i = 0; i < array$field_int32.length; i++) {
      var $field_int32 = array$field_int32[i];
      buffer.writeVarint32(8);
      buffer.writeVarint64($field_int32 | 0);
    }
  }

  // repeated int64 field_int64 = 2;
  var array$field_int64 = message.field_int64;
  if (array$field_int64 !== undefined) {
    for (var i = 0; i < array$field_int64.length; i++) {
      var $field_int64 = array$field_int64[i];
      buffer.writeVarint32(16);
      buffer.writeVarint64(coerceLong($field_int64));
    }
  }

  // repeated uint32 field_uint32 = 3;
  var array$field_uint32 = message.field_uint32;
  if (array$field_uint32 !== undefined) {
    for (var i = 0; i < array$field_uint32.length; i++) {
      var $field_uint32 = array$field_uint32[i];
      buffer.writeVarint32(24);
      buffer.writeVarint32($field_uint32);
    }
  }

  // repeated uint64 field_uint64 = 4;
  var array$field_uint64 = message.field_uint64;
  if (array$field_uint64 !== undefined) {
    for (var i = 0; i < array$field_uint64.length; i++) {
      var $field_uint64 = array$field_uint64[i];
      buffer.writeVarint32(32);
      buffer.writeVarint64(coerceLong($field_uint64));
    }
  }

  // repeated sint32 field_sint32 = 5;
  var array$field_sint32 = message.field_sint32;
  if (array$field_sint32 !== undefined) {
    for (var i = 0; i < array$field_sint32.length; i++) {
      var $field_sint32 = array$field_sint32[i];
      buffer.writeVarint32(40);
      buffer.writeVarint32ZigZag($field_sint32);
    }
  }

  // repeated sint64 field_sint64 = 6;
  var array$field_sint64 = message.field_sint64;
  if (array$field_sint64 !== undefined) {
    for (var i = 0; i < array$field_sint64.length; i++) {
      var $field_sint64 = array$field_sint64[i];
      buffer.writeVarint32(48);
      buffer.writeVarint64ZigZag(coerceLong($field_sint64));
    }
  }

  // repeated bool field_bool = 7;
  var array$field_bool = message.field_bool;
  if (array$field_bool !== undefined) {
    for (var i = 0; i < array$field_bool.length; i++) {
      var $field_bool = array$field_bool[i];
      buffer.writeVarint32(56);
      buffer.writeByte($field_bool ? 1 : 0);
    }
  }

  // repeated fixed64 field_fixed64 = 8;
  var array$field_fixed64 = message.field_fixed64;
  if (array$field_fixed64 !== undefined) {
    for (var i = 0; i < array$field_fixed64.length; i++) {
      var $field_fixed64 = array$field_fixed64[i];
      buffer.writeVarint32(65);
      buffer.writeUint64(coerceLong($field_fixed64));
    }
  }

  // repeated sfixed64 field_sfixed64 = 9;
  var array$field_sfixed64 = message.field_sfixed64;
  if (array$field_sfixed64 !== undefined) {
    for (var i = 0; i < array$field_sfixed64.length; i++) {
      var $field_sfixed64 = array$field_sfixed64[i];
      buffer.writeVarint32(73);
      buffer.writeInt64(coerceLong($field_sfixed64));
    }
  }

  // repeated double field_double = 10;
  var array$field_double = message.field_double;
  if (array$field_double !== undefined) {
    for (var i = 0; i < array$field_double.length; i++) {
      var $field_double = array$field_double[i];
      buffer.writeVarint32(81);
      buffer.writeDouble($field_double);
    }
  }

  // repeated string field_string = 11;
  var array$field_string = message.field_string;
  if (array$field_string !== undefined) {
    for (var i = 0; i < array$field_string.length; i++) {
      var $field_string = array$field_string[i];
      var nested = new ByteBuffer(undefined, /* isLittleEndian */ true);
      buffer.writeVarint32(90);
      nested.writeUTF8String($field_string), buffer.writeVarint32(nested.flip().limit), buffer.append(nested);
    }
  }

  // repeated bytes field_bytes = 12;
  var array$field_bytes = message.field_bytes;
  if (array$field_bytes !== undefined) {
    for (var i = 0; i < array$field_bytes.length; i++) {
      var $field_bytes = array$field_bytes[i];
      buffer.writeVarint32(98);
      buffer.writeVarint32($field_bytes.length), buffer.append($field_bytes);
    }
  }

  // repeated fixed32 field_fixed32 = 13;
  var array$field_fixed32 = message.field_fixed32;
  if (array$field_fixed32 !== undefined) {
    for (var i = 0; i < array$field_fixed32.length; i++) {
      var $field_fixed32 = array$field_fixed32[i];
      buffer.writeVarint32(109);
      buffer.writeUint32($field_fixed32);
    }
  }

  // repeated sfixed32 field_sfixed32 = 14;
  var array$field_sfixed32 = message.field_sfixed32;
  if (array$field_sfixed32 !== undefined) {
    for (var i = 0; i < array$field_sfixed32.length; i++) {
      var $field_sfixed32 = array$field_sfixed32[i];
      buffer.writeVarint32(117);
      buffer.writeInt32($field_sfixed32);
    }
  }

  // repeated float field_float = 15;
  var array$field_float = message.field_float;
  if (array$field_float !== undefined) {
    for (var i = 0; i < array$field_float.length; i++) {
      var $field_float = array$field_float[i];
      buffer.writeVarint32(125);
      buffer.writeFloat($field_float);
    }
  }

  // repeated Nested field_nested = 16;
  var array$field_nested = message.field_nested;
  if (array$field_nested !== undefined) {
    for (var i = 0; i < array$field_nested.length; i++) {
      var $field_nested = array$field_nested[i];
      var nested = test.encodeNested($field_nested);
      buffer.writeVarint32(130);
      buffer.writeVarint32(nested.byteLength), buffer.append(nested);
    }
  }

  return buffer.flip().toBuffer();
};

test.decodeRepeatedUnpacked = function(binary) {
  var message = {};
  var buffer = binary instanceof ByteBuffer ? binary : ByteBuffer.wrap(binary, /* isLittleEndian */ true);

  end_of_message: while (buffer.remaining() > 0) {
    var tag = buffer.readVarint32();

    switch (tag >>> 3) {
    case 0:
      break end_of_message;

    // repeated int32 field_int32 = 1;
    case 1: {
      var values = message.field_int32 || (message.field_int32 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readVarint32());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readVarint32());
      }
      break;
    }

    // repeated int64 field_int64 = 2;
    case 2: {
      var values = message.field_int64 || (message.field_int64 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readVarint64());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readVarint64());
      }
      break;
    }

    // repeated uint32 field_uint32 = 3;
    case 3: {
      var values = message.field_uint32 || (message.field_uint32 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readVarint32() >>> 0);
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readVarint32() >>> 0);
      }
      break;
    }

    // repeated uint64 field_uint64 = 4;
    case 4: {
      var values = message.field_uint64 || (message.field_uint64 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readVarint64().toUnsigned());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readVarint64().toUnsigned());
      }
      break;
    }

    // repeated sint32 field_sint32 = 5;
    case 5: {
      var values = message.field_sint32 || (message.field_sint32 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readVarint32ZigZag());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readVarint32ZigZag());
      }
      break;
    }

    // repeated sint64 field_sint64 = 6;
    case 6: {
      var values = message.field_sint64 || (message.field_sint64 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readVarint64ZigZag());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readVarint64ZigZag());
      }
      break;
    }

    // repeated bool field_bool = 7;
    case 7: {
      var values = message.field_bool || (message.field_bool = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(!!buffer.readByte());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(!!buffer.readByte());
      }
      break;
    }

    // repeated fixed64 field_fixed64 = 8;
    case 8: {
      var values = message.field_fixed64 || (message.field_fixed64 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readUint64());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readUint64());
      }
      break;
    }

    // repeated sfixed64 field_sfixed64 = 9;
    case 9: {
      var values = message.field_sfixed64 || (message.field_sfixed64 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readInt64());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readInt64());
      }
      break;
    }

    // repeated double field_double = 10;
    case 10: {
      var values = message.field_double || (message.field_double = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readDouble());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readDouble());
      }
      break;
    }

    // repeated string field_string = 11;
    case 11: {
      var values = message.field_string || (message.field_string = []);
      values.push(buffer.readUTF8String(buffer.readVarint32(), ByteBuffer.METRICS_BYTES));
      break;
    }

    // repeated bytes field_bytes = 12;
    case 12: {
      var values = message.field_bytes || (message.field_bytes = []);
      values.push(buffer.readBytes(buffer.readVarint32()).toBuffer());
      break;
    }

    // repeated fixed32 field_fixed32 = 13;
    case 13: {
      var values = message.field_fixed32 || (message.field_fixed32 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readUint32());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readUint32());
      }
      break;
    }

    // repeated sfixed32 field_sfixed32 = 14;
    case 14: {
      var values = message.field_sfixed32 || (message.field_sfixed32 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readInt32());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readInt32());
      }
      break;
    }

    // repeated float field_float = 15;
    case 15: {
      var values = message.field_float || (message.field_float = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readFloat());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readFloat());
      }
      break;
    }

    // repeated Nested field_nested = 16;
    case 16: {
      var limit = pushTemporaryLength(buffer);
      var values = message.field_nested || (message.field_nested = []);
      values.push(test.decodeNested(buffer));
      buffer.limit = limit;
      break;
    }

    default:
      skipUnknownField(buffer, tag & 7);
    }
  }

  return message;
};

test.encodeRepeatedPacked = function(message) {
  var buffer = new ByteBuffer(undefined, /* isLittleEndian */ true);

  // repeated int32 field_int32 = 1;
  var array$field_int32 = message.field_int32;
  if (array$field_int32 !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_int32.length; i++) {
      var $field_int32 = array$field_int32[i];
      packed.writeVarint64($field_int32 | 0);
    }
    buffer.writeVarint32(10);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated int64 field_int64 = 2;
  var array$field_int64 = message.field_int64;
  if (array$field_int64 !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_int64.length; i++) {
      var $field_int64 = array$field_int64[i];
      packed.writeVarint64(coerceLong($field_int64));
    }
    buffer.writeVarint32(18);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated uint32 field_uint32 = 3;
  var array$field_uint32 = message.field_uint32;
  if (array$field_uint32 !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_uint32.length; i++) {
      var $field_uint32 = array$field_uint32[i];
      packed.writeVarint32($field_uint32);
    }
    buffer.writeVarint32(26);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated uint64 field_uint64 = 4;
  var array$field_uint64 = message.field_uint64;
  if (array$field_uint64 !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_uint64.length; i++) {
      var $field_uint64 = array$field_uint64[i];
      packed.writeVarint64(coerceLong($field_uint64));
    }
    buffer.writeVarint32(34);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated sint32 field_sint32 = 5;
  var array$field_sint32 = message.field_sint32;
  if (array$field_sint32 !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_sint32.length; i++) {
      var $field_sint32 = array$field_sint32[i];
      packed.writeVarint32ZigZag($field_sint32);
    }
    buffer.writeVarint32(42);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated sint64 field_sint64 = 6;
  var array$field_sint64 = message.field_sint64;
  if (array$field_sint64 !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_sint64.length; i++) {
      var $field_sint64 = array$field_sint64[i];
      packed.writeVarint64ZigZag(coerceLong($field_sint64));
    }
    buffer.writeVarint32(50);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated bool field_bool = 7;
  var array$field_bool = message.field_bool;
  if (array$field_bool !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_bool.length; i++) {
      var $field_bool = array$field_bool[i];
      packed.writeByte($field_bool ? 1 : 0);
    }
    buffer.writeVarint32(58);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated fixed64 field_fixed64 = 8;
  var array$field_fixed64 = message.field_fixed64;
  if (array$field_fixed64 !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_fixed64.length; i++) {
      var $field_fixed64 = array$field_fixed64[i];
      packed.writeUint64(coerceLong($field_fixed64));
    }
    buffer.writeVarint32(66);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated sfixed64 field_sfixed64 = 9;
  var array$field_sfixed64 = message.field_sfixed64;
  if (array$field_sfixed64 !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_sfixed64.length; i++) {
      var $field_sfixed64 = array$field_sfixed64[i];
      packed.writeInt64(coerceLong($field_sfixed64));
    }
    buffer.writeVarint32(74);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated double field_double = 10;
  var array$field_double = message.field_double;
  if (array$field_double !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_double.length; i++) {
      var $field_double = array$field_double[i];
      packed.writeDouble($field_double);
    }
    buffer.writeVarint32(82);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated string field_string = 11;
  var array$field_string = message.field_string;
  if (array$field_string !== undefined) {
    for (var i = 0; i < array$field_string.length; i++) {
      var $field_string = array$field_string[i];
      var nested = new ByteBuffer(undefined, /* isLittleEndian */ true);
      buffer.writeVarint32(90);
      nested.writeUTF8String($field_string), buffer.writeVarint32(nested.flip().limit), buffer.append(nested);
    }
  }

  // repeated bytes field_bytes = 12;
  var array$field_bytes = message.field_bytes;
  if (array$field_bytes !== undefined) {
    for (var i = 0; i < array$field_bytes.length; i++) {
      var $field_bytes = array$field_bytes[i];
      buffer.writeVarint32(98);
      buffer.writeVarint32($field_bytes.length), buffer.append($field_bytes);
    }
  }

  // repeated fixed32 field_fixed32 = 13;
  var array$field_fixed32 = message.field_fixed32;
  if (array$field_fixed32 !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_fixed32.length; i++) {
      var $field_fixed32 = array$field_fixed32[i];
      packed.writeUint32($field_fixed32);
    }
    buffer.writeVarint32(106);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated sfixed32 field_sfixed32 = 14;
  var array$field_sfixed32 = message.field_sfixed32;
  if (array$field_sfixed32 !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_sfixed32.length; i++) {
      var $field_sfixed32 = array$field_sfixed32[i];
      packed.writeInt32($field_sfixed32);
    }
    buffer.writeVarint32(114);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated float field_float = 15;
  var array$field_float = message.field_float;
  if (array$field_float !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$field_float.length; i++) {
      var $field_float = array$field_float[i];
      packed.writeFloat($field_float);
    }
    buffer.writeVarint32(122);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated Nested field_nested = 16;
  var array$field_nested = message.field_nested;
  if (array$field_nested !== undefined) {
    for (var i = 0; i < array$field_nested.length; i++) {
      var $field_nested = array$field_nested[i];
      var nested = test.encodeNested($field_nested);
      buffer.writeVarint32(130);
      buffer.writeVarint32(nested.byteLength), buffer.append(nested);
    }
  }

  // repeated Nested field_nested2 = 17;
  var array$field_nested2 = message.field_nested2;
  if (array$field_nested2 !== undefined) {
    for (var i = 0; i < array$field_nested2.length; i++) {
      var $field_nested2 = array$field_nested2[i];
      var nested = test.encodeNested($field_nested2);
      buffer.writeVarint32(138);
      buffer.writeVarint32(nested.byteLength), buffer.append(nested);
    }
  }

  return buffer.flip().toBuffer();
};

test.decodeRepeatedPacked = function(binary) {
  var message = {};
  var buffer = binary instanceof ByteBuffer ? binary : ByteBuffer.wrap(binary, /* isLittleEndian */ true);

  end_of_message: while (buffer.remaining() > 0) {
    var tag = buffer.readVarint32();

    switch (tag >>> 3) {
    case 0:
      break end_of_message;

    // repeated int32 field_int32 = 1;
    case 1: {
      var values = message.field_int32 || (message.field_int32 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readVarint32());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readVarint32());
      }
      break;
    }

    // repeated int64 field_int64 = 2;
    case 2: {
      var values = message.field_int64 || (message.field_int64 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readVarint64());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readVarint64());
      }
      break;
    }

    // repeated uint32 field_uint32 = 3;
    case 3: {
      var values = message.field_uint32 || (message.field_uint32 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readVarint32() >>> 0);
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readVarint32() >>> 0);
      }
      break;
    }

    // repeated uint64 field_uint64 = 4;
    case 4: {
      var values = message.field_uint64 || (message.field_uint64 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readVarint64().toUnsigned());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readVarint64().toUnsigned());
      }
      break;
    }

    // repeated sint32 field_sint32 = 5;
    case 5: {
      var values = message.field_sint32 || (message.field_sint32 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readVarint32ZigZag());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readVarint32ZigZag());
      }
      break;
    }

    // repeated sint64 field_sint64 = 6;
    case 6: {
      var values = message.field_sint64 || (message.field_sint64 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readVarint64ZigZag());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readVarint64ZigZag());
      }
      break;
    }

    // repeated bool field_bool = 7;
    case 7: {
      var values = message.field_bool || (message.field_bool = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(!!buffer.readByte());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(!!buffer.readByte());
      }
      break;
    }

    // repeated fixed64 field_fixed64 = 8;
    case 8: {
      var values = message.field_fixed64 || (message.field_fixed64 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readUint64());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readUint64());
      }
      break;
    }

    // repeated sfixed64 field_sfixed64 = 9;
    case 9: {
      var values = message.field_sfixed64 || (message.field_sfixed64 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readInt64());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readInt64());
      }
      break;
    }

    // repeated double field_double = 10;
    case 10: {
      var values = message.field_double || (message.field_double = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readDouble());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readDouble());
      }
      break;
    }

    // repeated string field_string = 11;
    case 11: {
      var values = message.field_string || (message.field_string = []);
      values.push(buffer.readUTF8String(buffer.readVarint32(), ByteBuffer.METRICS_BYTES));
      break;
    }

    // repeated bytes field_bytes = 12;
    case 12: {
      var values = message.field_bytes || (message.field_bytes = []);
      values.push(buffer.readBytes(buffer.readVarint32()).toBuffer());
      break;
    }

    // repeated fixed32 field_fixed32 = 13;
    case 13: {
      var values = message.field_fixed32 || (message.field_fixed32 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readUint32());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readUint32());
      }
      break;
    }

    // repeated sfixed32 field_sfixed32 = 14;
    case 14: {
      var values = message.field_sfixed32 || (message.field_sfixed32 = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readInt32());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readInt32());
      }
      break;
    }

    // repeated float field_float = 15;
    case 15: {
      var values = message.field_float || (message.field_float = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(buffer.readFloat());
        }
        buffer.limit = outerLimit;
      } else {
        values.push(buffer.readFloat());
      }
      break;
    }

    // repeated Nested field_nested = 16;
    case 16: {
      var limit = pushTemporaryLength(buffer);
      var values = message.field_nested || (message.field_nested = []);
      values.push(test.decodeNested(buffer));
      buffer.limit = limit;
      break;
    }

    // repeated Nested field_nested2 = 17;
    case 17: {
      var limit = pushTemporaryLength(buffer);
      var values = message.field_nested2 || (message.field_nested2 = []);
      values.push(test.decodeNested(buffer));
      buffer.limit = limit;
      break;
    }

    default:
      skipUnknownField(buffer, tag & 7);
    }
  }

  return message;
};

test.encodeEnumTest = function(message) {
  var buffer = new ByteBuffer(undefined, /* isLittleEndian */ true);

  // optional Enum a = 1;
  var $a = message.a;
  if ($a !== undefined) {
    buffer.writeVarint32(8);
    buffer.writeVarint32(test.encodeEnum[$a]);
  }

  // required Enum b = 2;
  var $b = message.b;
  if ($b !== undefined) {
    buffer.writeVarint32(16);
    buffer.writeVarint32(test.encodeEnum[$b]);
  }

  // repeated Enum c = 3;
  var array$c = message.c;
  if (array$c !== undefined) {
    var packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (var i = 0; i < array$c.length; i++) {
      var $c = array$c[i];
      packed.writeVarint32(test.encodeEnum[$c]);
    }
    buffer.writeVarint32(26);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  return buffer.flip().toBuffer();
};

test.decodeEnumTest = function(binary) {
  var message = {};
  var buffer = binary instanceof ByteBuffer ? binary : ByteBuffer.wrap(binary, /* isLittleEndian */ true);

  end_of_message: while (buffer.remaining() > 0) {
    var tag = buffer.readVarint32();

    switch (tag >>> 3) {
    case 0:
      break end_of_message;

    // optional Enum a = 1;
    case 1: {
      message.a = test.decodeEnum[buffer.readVarint32()];
      break;
    }

    // required Enum b = 2;
    case 2: {
      message.b = test.decodeEnum[buffer.readVarint32()];
      break;
    }

    // repeated Enum c = 3;
    case 3: {
      var values = message.c || (message.c = []);
      if ((tag & 7) === 2) {
        var outerLimit = pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(test.decodeEnum[buffer.readVarint32()]);
        }
        buffer.limit = outerLimit;
      } else {
        values.push(test.decodeEnum[buffer.readVarint32()]);
      }
      break;
    }

    default:
      skipUnknownField(buffer, tag & 7);
    }
  }

  if (message.b === undefined)
    throw new Error("Missing required field: b");

  return message;
};

})();
