
function pushTemporaryLength(bb) {
  var length = readVarint32(bb);
  var limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb, type) {
  switch (type) {
    case 0: while (readByte(bb) & 0x80) { } break;
    case 2: skip(bb, readVarint32(bb)); break;
    case 5: skip(bb, 4); break;
    case 1: skip(bb, 8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

exports.encodeEnum = {
  A: 0,
  B: 1,
};

exports.decodeEnum = {
  0: "A",
  1: "B",
};

exports.encodeNested = function (message) {
  var bb = newByteBuffer();

  // optional float x = 1;
  var $x = message.x;
  if ($x !== undefined) {
    writeVarint32(bb, 13);
    writeFloat(bb, $x);
  }

  // optional float y = 2;
  var $y = message.y;
  if ($y !== undefined) {
    writeVarint32(bb, 21);
    writeFloat(bb, $y);
  }

  return toUint8Array(bb);
};

exports.decodeNested = function (binary) {
  var message = {};
  var bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional float x = 1;
      case 1: {
        message.x = readFloat(bb);
        break;
      }

      // optional float y = 2;
      case 2: {
        message.y = readFloat(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeOptional = function (message) {
  var bb = newByteBuffer();

  // optional int32 field_int32 = 1;
  var $field_int32 = message.field_int32;
  if ($field_int32 !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, intToLong($field_int32));
  }

  // optional int64 field_int64 = 2;
  var $field_int64 = message.field_int64;
  if ($field_int64 !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, $field_int64);
  }

  // optional uint32 field_uint32 = 3;
  var $field_uint32 = message.field_uint32;
  if ($field_uint32 !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $field_uint32);
  }

  // optional uint64 field_uint64 = 4;
  var $field_uint64 = message.field_uint64;
  if ($field_uint64 !== undefined) {
    writeVarint32(bb, 32);
    writeVarint64(bb, $field_uint64);
  }

  // optional sint32 field_sint32 = 5;
  var $field_sint32 = message.field_sint32;
  if ($field_sint32 !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32ZigZag(bb, $field_sint32);
  }

  // optional sint64 field_sint64 = 6;
  var $field_sint64 = message.field_sint64;
  if ($field_sint64 !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64ZigZag(bb, $field_sint64);
  }

  // optional bool field_bool = 7;
  var $field_bool = message.field_bool;
  if ($field_bool !== undefined) {
    writeVarint32(bb, 56);
    writeByte(bb, $field_bool ? 1 : 0);
  }

  // optional fixed64 field_fixed64 = 8;
  var $field_fixed64 = message.field_fixed64;
  if ($field_fixed64 !== undefined) {
    writeVarint32(bb, 65);
    writeInt64(bb, $field_fixed64);
  }

  // optional sfixed64 field_sfixed64 = 9;
  var $field_sfixed64 = message.field_sfixed64;
  if ($field_sfixed64 !== undefined) {
    writeVarint32(bb, 73);
    writeInt64(bb, $field_sfixed64);
  }

  // optional double field_double = 10;
  var $field_double = message.field_double;
  if ($field_double !== undefined) {
    writeVarint32(bb, 81);
    writeDouble(bb, $field_double);
  }

  // optional string field_string = 11;
  var $field_string = message.field_string;
  if ($field_string !== undefined) {
    writeVarint32(bb, 90);
    var nested = utf8Encoder.encode($field_string);
    writeVarint32(bb, nested.length), writeBytes(bb, nested);
  }

  // optional bytes field_bytes = 12;
  var $field_bytes = message.field_bytes;
  if ($field_bytes !== undefined) {
    writeVarint32(bb, 98);
    writeVarint32(bb, $field_bytes.length), writeBytes(bb, $field_bytes);
  }

  // optional fixed32 field_fixed32 = 13;
  var $field_fixed32 = message.field_fixed32;
  if ($field_fixed32 !== undefined) {
    writeVarint32(bb, 109);
    writeInt32(bb, $field_fixed32);
  }

  // optional sfixed32 field_sfixed32 = 14;
  var $field_sfixed32 = message.field_sfixed32;
  if ($field_sfixed32 !== undefined) {
    writeVarint32(bb, 117);
    writeInt32(bb, $field_sfixed32);
  }

  // optional float field_float = 15;
  var $field_float = message.field_float;
  if ($field_float !== undefined) {
    writeVarint32(bb, 125);
    writeFloat(bb, $field_float);
  }

  // optional Nested field_nested = 16;
  var $field_nested = message.field_nested;
  if ($field_nested !== undefined) {
    writeVarint32(bb, 130);
    var nested = exports.encodeNested($field_nested);
    writeVarint32(bb, nested.length), writeBytes(bb, nested);
  }

  return toUint8Array(bb);
};

exports.decodeOptional = function (binary) {
  var message = {};
  var bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional int32 field_int32 = 1;
      case 1: {
        message.field_int32 = readVarint32(bb);
        break;
      }

      // optional int64 field_int64 = 2;
      case 2: {
        message.field_int64 = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional uint32 field_uint32 = 3;
      case 3: {
        message.field_uint32 = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint64 field_uint64 = 4;
      case 4: {
        message.field_uint64 = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional sint32 field_sint32 = 5;
      case 5: {
        message.field_sint32 = readVarint32ZigZag(bb);
        break;
      }

      // optional sint64 field_sint64 = 6;
      case 6: {
        message.field_sint64 = readVarint64ZigZag(bb);
        break;
      }

      // optional bool field_bool = 7;
      case 7: {
        message.field_bool = !!readByte(bb);
        break;
      }

      // optional fixed64 field_fixed64 = 8;
      case 8: {
        message.field_fixed64 = readInt64(bb, /* unsigned */ true);
        break;
      }

      // optional sfixed64 field_sfixed64 = 9;
      case 9: {
        message.field_sfixed64 = readInt64(bb, /* unsigned */ false);
        break;
      }

      // optional double field_double = 10;
      case 10: {
        message.field_double = readDouble(bb);
        break;
      }

      // optional string field_string = 11;
      case 11: {
        message.field_string = utf8Decoder.decode(readBytes(bb, readVarint32(bb)));
        break;
      }

      // optional bytes field_bytes = 12;
      case 12: {
        message.field_bytes = readBytes(bb, readVarint32(bb));
        break;
      }

      // optional fixed32 field_fixed32 = 13;
      case 13: {
        message.field_fixed32 = readInt32(bb) >>> 0;
        break;
      }

      // optional sfixed32 field_sfixed32 = 14;
      case 14: {
        message.field_sfixed32 = readInt32(bb);
        break;
      }

      // optional float field_float = 15;
      case 15: {
        message.field_float = readFloat(bb);
        break;
      }

      // optional Nested field_nested = 16;
      case 16: {
        var limit = pushTemporaryLength(bb);
        message.field_nested = exports.decodeNested(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeRepeatedUnpacked = function (message) {
  var bb = newByteBuffer();

  // repeated int32 field_int32 = 1;
  var array$field_int32 = message.field_int32;
  if (array$field_int32 !== undefined) {
    for (var i = 0; i < array$field_int32.length; i++) {
      var $field_int32 = array$field_int32[i];
      writeVarint32(bb, 8);
      writeVarint64(bb, intToLong($field_int32));
    }
  }

  // repeated int64 field_int64 = 2;
  var array$field_int64 = message.field_int64;
  if (array$field_int64 !== undefined) {
    for (var i = 0; i < array$field_int64.length; i++) {
      var $field_int64 = array$field_int64[i];
      writeVarint32(bb, 16);
      writeVarint64(bb, $field_int64);
    }
  }

  // repeated uint32 field_uint32 = 3;
  var array$field_uint32 = message.field_uint32;
  if (array$field_uint32 !== undefined) {
    for (var i = 0; i < array$field_uint32.length; i++) {
      var $field_uint32 = array$field_uint32[i];
      writeVarint32(bb, 24);
      writeVarint32(bb, $field_uint32);
    }
  }

  // repeated uint64 field_uint64 = 4;
  var array$field_uint64 = message.field_uint64;
  if (array$field_uint64 !== undefined) {
    for (var i = 0; i < array$field_uint64.length; i++) {
      var $field_uint64 = array$field_uint64[i];
      writeVarint32(bb, 32);
      writeVarint64(bb, $field_uint64);
    }
  }

  // repeated sint32 field_sint32 = 5;
  var array$field_sint32 = message.field_sint32;
  if (array$field_sint32 !== undefined) {
    for (var i = 0; i < array$field_sint32.length; i++) {
      var $field_sint32 = array$field_sint32[i];
      writeVarint32(bb, 40);
      writeVarint32ZigZag(bb, $field_sint32);
    }
  }

  // repeated sint64 field_sint64 = 6;
  var array$field_sint64 = message.field_sint64;
  if (array$field_sint64 !== undefined) {
    for (var i = 0; i < array$field_sint64.length; i++) {
      var $field_sint64 = array$field_sint64[i];
      writeVarint32(bb, 48);
      writeVarint64ZigZag(bb, $field_sint64);
    }
  }

  // repeated bool field_bool = 7;
  var array$field_bool = message.field_bool;
  if (array$field_bool !== undefined) {
    for (var i = 0; i < array$field_bool.length; i++) {
      var $field_bool = array$field_bool[i];
      writeVarint32(bb, 56);
      writeByte(bb, $field_bool ? 1 : 0);
    }
  }

  // repeated fixed64 field_fixed64 = 8;
  var array$field_fixed64 = message.field_fixed64;
  if (array$field_fixed64 !== undefined) {
    for (var i = 0; i < array$field_fixed64.length; i++) {
      var $field_fixed64 = array$field_fixed64[i];
      writeVarint32(bb, 65);
      writeInt64(bb, $field_fixed64);
    }
  }

  // repeated sfixed64 field_sfixed64 = 9;
  var array$field_sfixed64 = message.field_sfixed64;
  if (array$field_sfixed64 !== undefined) {
    for (var i = 0; i < array$field_sfixed64.length; i++) {
      var $field_sfixed64 = array$field_sfixed64[i];
      writeVarint32(bb, 73);
      writeInt64(bb, $field_sfixed64);
    }
  }

  // repeated double field_double = 10;
  var array$field_double = message.field_double;
  if (array$field_double !== undefined) {
    for (var i = 0; i < array$field_double.length; i++) {
      var $field_double = array$field_double[i];
      writeVarint32(bb, 81);
      writeDouble(bb, $field_double);
    }
  }

  // repeated string field_string = 11;
  var array$field_string = message.field_string;
  if (array$field_string !== undefined) {
    for (var i = 0; i < array$field_string.length; i++) {
      var $field_string = array$field_string[i];
      var nested = utf8Encoder.encode($field_string);
      writeVarint32(bb, 90);
      writeVarint32(bb, nested.length), writeBytes(bb, nested);
    }
  }

  // repeated bytes field_bytes = 12;
  var array$field_bytes = message.field_bytes;
  if (array$field_bytes !== undefined) {
    for (var i = 0; i < array$field_bytes.length; i++) {
      var $field_bytes = array$field_bytes[i];
      writeVarint32(bb, 98);
      writeVarint32(bb, $field_bytes.length), writeBytes(bb, $field_bytes);
    }
  }

  // repeated fixed32 field_fixed32 = 13;
  var array$field_fixed32 = message.field_fixed32;
  if (array$field_fixed32 !== undefined) {
    for (var i = 0; i < array$field_fixed32.length; i++) {
      var $field_fixed32 = array$field_fixed32[i];
      writeVarint32(bb, 109);
      writeInt32(bb, $field_fixed32);
    }
  }

  // repeated sfixed32 field_sfixed32 = 14;
  var array$field_sfixed32 = message.field_sfixed32;
  if (array$field_sfixed32 !== undefined) {
    for (var i = 0; i < array$field_sfixed32.length; i++) {
      var $field_sfixed32 = array$field_sfixed32[i];
      writeVarint32(bb, 117);
      writeInt32(bb, $field_sfixed32);
    }
  }

  // repeated float field_float = 15;
  var array$field_float = message.field_float;
  if (array$field_float !== undefined) {
    for (var i = 0; i < array$field_float.length; i++) {
      var $field_float = array$field_float[i];
      writeVarint32(bb, 125);
      writeFloat(bb, $field_float);
    }
  }

  // repeated Nested field_nested = 16;
  var array$field_nested = message.field_nested;
  if (array$field_nested !== undefined) {
    for (var i = 0; i < array$field_nested.length; i++) {
      var $field_nested = array$field_nested[i];
      var nested = exports.encodeNested($field_nested);
      writeVarint32(bb, 130);
      writeVarint32(bb, nested.length), writeBytes(bb, nested);
    }
  }

  return toUint8Array(bb);
};

exports.decodeRepeatedUnpacked = function (binary) {
  var message = {};
  var bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated int32 field_int32 = 1;
      case 1: {
        var values = message.field_int32 || (message.field_int32 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated int64 field_int64 = 2;
      case 2: {
        var values = message.field_int64 || (message.field_int64 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint64(bb, /* unsigned */ false));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint64(bb, /* unsigned */ false));
        }
        break;
      }

      // repeated uint32 field_uint32 = 3;
      case 3: {
        var values = message.field_uint32 || (message.field_uint32 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint64 field_uint64 = 4;
      case 4: {
        var values = message.field_uint64 || (message.field_uint64 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint64(bb, /* unsigned */ true));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint64(bb, /* unsigned */ true));
        }
        break;
      }

      // repeated sint32 field_sint32 = 5;
      case 5: {
        var values = message.field_sint32 || (message.field_sint32 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32ZigZag(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32ZigZag(bb));
        }
        break;
      }

      // repeated sint64 field_sint64 = 6;
      case 6: {
        var values = message.field_sint64 || (message.field_sint64 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint64ZigZag(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint64ZigZag(bb));
        }
        break;
      }

      // repeated bool field_bool = 7;
      case 7: {
        var values = message.field_bool || (message.field_bool = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(!!readByte(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(!!readByte(bb));
        }
        break;
      }

      // repeated fixed64 field_fixed64 = 8;
      case 8: {
        var values = message.field_fixed64 || (message.field_fixed64 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readInt64(bb, /* unsigned */ true));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readInt64(bb, /* unsigned */ true));
        }
        break;
      }

      // repeated sfixed64 field_sfixed64 = 9;
      case 9: {
        var values = message.field_sfixed64 || (message.field_sfixed64 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readInt64(bb, /* unsigned */ false));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readInt64(bb, /* unsigned */ false));
        }
        break;
      }

      // repeated double field_double = 10;
      case 10: {
        var values = message.field_double || (message.field_double = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readDouble(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readDouble(bb));
        }
        break;
      }

      // repeated string field_string = 11;
      case 11: {
        var values = message.field_string || (message.field_string = []);
        values.push(utf8Decoder.decode(readBytes(bb, readVarint32(bb))));
        break;
      }

      // repeated bytes field_bytes = 12;
      case 12: {
        var values = message.field_bytes || (message.field_bytes = []);
        values.push(readBytes(bb, readVarint32(bb)));
        break;
      }

      // repeated fixed32 field_fixed32 = 13;
      case 13: {
        var values = message.field_fixed32 || (message.field_fixed32 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readInt32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readInt32(bb) >>> 0);
        }
        break;
      }

      // repeated sfixed32 field_sfixed32 = 14;
      case 14: {
        var values = message.field_sfixed32 || (message.field_sfixed32 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readInt32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readInt32(bb));
        }
        break;
      }

      // repeated float field_float = 15;
      case 15: {
        var values = message.field_float || (message.field_float = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readFloat(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readFloat(bb));
        }
        break;
      }

      // repeated Nested field_nested = 16;
      case 16: {
        var limit = pushTemporaryLength(bb);
        var values = message.field_nested || (message.field_nested = []);
        values.push(exports.decodeNested(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeRepeatedPacked = function (message) {
  var bb = newByteBuffer();

  // repeated int32 field_int32 = 1;
  var array$field_int32 = message.field_int32;
  if (array$field_int32 !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_int32.length; i++) {
      var $field_int32 = array$field_int32[i];
      writeVarint64(packed, intToLong($field_int32));
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated int64 field_int64 = 2;
  var array$field_int64 = message.field_int64;
  if (array$field_int64 !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_int64.length; i++) {
      var $field_int64 = array$field_int64[i];
      writeVarint64(packed, $field_int64);
    }
    writeVarint32(bb, 18);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated uint32 field_uint32 = 3;
  var array$field_uint32 = message.field_uint32;
  if (array$field_uint32 !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_uint32.length; i++) {
      var $field_uint32 = array$field_uint32[i];
      writeVarint32(packed, $field_uint32);
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated uint64 field_uint64 = 4;
  var array$field_uint64 = message.field_uint64;
  if (array$field_uint64 !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_uint64.length; i++) {
      var $field_uint64 = array$field_uint64[i];
      writeVarint64(packed, $field_uint64);
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated sint32 field_sint32 = 5;
  var array$field_sint32 = message.field_sint32;
  if (array$field_sint32 !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_sint32.length; i++) {
      var $field_sint32 = array$field_sint32[i];
      writeVarint32ZigZag(packed, $field_sint32);
    }
    writeVarint32(bb, 42);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated sint64 field_sint64 = 6;
  var array$field_sint64 = message.field_sint64;
  if (array$field_sint64 !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_sint64.length; i++) {
      var $field_sint64 = array$field_sint64[i];
      writeVarint64ZigZag(packed, $field_sint64);
    }
    writeVarint32(bb, 50);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated bool field_bool = 7;
  var array$field_bool = message.field_bool;
  if (array$field_bool !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_bool.length; i++) {
      var $field_bool = array$field_bool[i];
      writeByte(packed, $field_bool ? 1 : 0);
    }
    writeVarint32(bb, 58);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated fixed64 field_fixed64 = 8;
  var array$field_fixed64 = message.field_fixed64;
  if (array$field_fixed64 !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_fixed64.length; i++) {
      var $field_fixed64 = array$field_fixed64[i];
      writeInt64(packed, $field_fixed64);
    }
    writeVarint32(bb, 66);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated sfixed64 field_sfixed64 = 9;
  var array$field_sfixed64 = message.field_sfixed64;
  if (array$field_sfixed64 !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_sfixed64.length; i++) {
      var $field_sfixed64 = array$field_sfixed64[i];
      writeInt64(packed, $field_sfixed64);
    }
    writeVarint32(bb, 74);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated double field_double = 10;
  var array$field_double = message.field_double;
  if (array$field_double !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_double.length; i++) {
      var $field_double = array$field_double[i];
      writeDouble(packed, $field_double);
    }
    writeVarint32(bb, 82);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated string field_string = 11;
  var array$field_string = message.field_string;
  if (array$field_string !== undefined) {
    for (var i = 0; i < array$field_string.length; i++) {
      var $field_string = array$field_string[i];
      var nested = utf8Encoder.encode($field_string);
      writeVarint32(bb, 90);
      writeVarint32(bb, nested.length), writeBytes(bb, nested);
    }
  }

  // repeated bytes field_bytes = 12;
  var array$field_bytes = message.field_bytes;
  if (array$field_bytes !== undefined) {
    for (var i = 0; i < array$field_bytes.length; i++) {
      var $field_bytes = array$field_bytes[i];
      writeVarint32(bb, 98);
      writeVarint32(bb, $field_bytes.length), writeBytes(bb, $field_bytes);
    }
  }

  // repeated fixed32 field_fixed32 = 13;
  var array$field_fixed32 = message.field_fixed32;
  if (array$field_fixed32 !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_fixed32.length; i++) {
      var $field_fixed32 = array$field_fixed32[i];
      writeInt32(packed, $field_fixed32);
    }
    writeVarint32(bb, 106);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated sfixed32 field_sfixed32 = 14;
  var array$field_sfixed32 = message.field_sfixed32;
  if (array$field_sfixed32 !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_sfixed32.length; i++) {
      var $field_sfixed32 = array$field_sfixed32[i];
      writeInt32(packed, $field_sfixed32);
    }
    writeVarint32(bb, 114);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated float field_float = 15;
  var array$field_float = message.field_float;
  if (array$field_float !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$field_float.length; i++) {
      var $field_float = array$field_float[i];
      writeFloat(packed, $field_float);
    }
    writeVarint32(bb, 122);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated Nested field_nested = 16;
  var array$field_nested = message.field_nested;
  if (array$field_nested !== undefined) {
    for (var i = 0; i < array$field_nested.length; i++) {
      var $field_nested = array$field_nested[i];
      var nested = exports.encodeNested($field_nested);
      writeVarint32(bb, 130);
      writeVarint32(bb, nested.length), writeBytes(bb, nested);
    }
  }

  return toUint8Array(bb);
};

exports.decodeRepeatedPacked = function (binary) {
  var message = {};
  var bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated int32 field_int32 = 1;
      case 1: {
        var values = message.field_int32 || (message.field_int32 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated int64 field_int64 = 2;
      case 2: {
        var values = message.field_int64 || (message.field_int64 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint64(bb, /* unsigned */ false));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint64(bb, /* unsigned */ false));
        }
        break;
      }

      // repeated uint32 field_uint32 = 3;
      case 3: {
        var values = message.field_uint32 || (message.field_uint32 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint64 field_uint64 = 4;
      case 4: {
        var values = message.field_uint64 || (message.field_uint64 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint64(bb, /* unsigned */ true));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint64(bb, /* unsigned */ true));
        }
        break;
      }

      // repeated sint32 field_sint32 = 5;
      case 5: {
        var values = message.field_sint32 || (message.field_sint32 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32ZigZag(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32ZigZag(bb));
        }
        break;
      }

      // repeated sint64 field_sint64 = 6;
      case 6: {
        var values = message.field_sint64 || (message.field_sint64 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint64ZigZag(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint64ZigZag(bb));
        }
        break;
      }

      // repeated bool field_bool = 7;
      case 7: {
        var values = message.field_bool || (message.field_bool = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(!!readByte(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(!!readByte(bb));
        }
        break;
      }

      // repeated fixed64 field_fixed64 = 8;
      case 8: {
        var values = message.field_fixed64 || (message.field_fixed64 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readInt64(bb, /* unsigned */ true));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readInt64(bb, /* unsigned */ true));
        }
        break;
      }

      // repeated sfixed64 field_sfixed64 = 9;
      case 9: {
        var values = message.field_sfixed64 || (message.field_sfixed64 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readInt64(bb, /* unsigned */ false));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readInt64(bb, /* unsigned */ false));
        }
        break;
      }

      // repeated double field_double = 10;
      case 10: {
        var values = message.field_double || (message.field_double = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readDouble(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readDouble(bb));
        }
        break;
      }

      // repeated string field_string = 11;
      case 11: {
        var values = message.field_string || (message.field_string = []);
        values.push(utf8Decoder.decode(readBytes(bb, readVarint32(bb))));
        break;
      }

      // repeated bytes field_bytes = 12;
      case 12: {
        var values = message.field_bytes || (message.field_bytes = []);
        values.push(readBytes(bb, readVarint32(bb)));
        break;
      }

      // repeated fixed32 field_fixed32 = 13;
      case 13: {
        var values = message.field_fixed32 || (message.field_fixed32 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readInt32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readInt32(bb) >>> 0);
        }
        break;
      }

      // repeated sfixed32 field_sfixed32 = 14;
      case 14: {
        var values = message.field_sfixed32 || (message.field_sfixed32 = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readInt32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readInt32(bb));
        }
        break;
      }

      // repeated float field_float = 15;
      case 15: {
        var values = message.field_float || (message.field_float = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readFloat(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readFloat(bb));
        }
        break;
      }

      // repeated Nested field_nested = 16;
      case 16: {
        var limit = pushTemporaryLength(bb);
        var values = message.field_nested || (message.field_nested = []);
        values.push(exports.decodeNested(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeEnumTest = function (message) {
  var bb = newByteBuffer();

  // optional Enum a = 1;
  var $a = message.a;
  if ($a !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEnum[$a]);
  }

  // required Enum b = 2;
  var $b = message.b;
  if ($b !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, exports.encodeEnum[$b]);
  }

  // repeated Enum c = 3;
  var array$c = message.c;
  if (array$c !== undefined) {
    var packed = newByteBuffer();
    for (var i = 0; i < array$c.length; i++) {
      var $c = array$c[i];
      writeVarint32(packed, exports.encodeEnum[$c]);
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  return toUint8Array(bb);
};

exports.decodeEnumTest = function (binary) {
  var message = {};
  var bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional Enum a = 1;
      case 1: {
        message.a = exports.decodeEnum[readVarint32(bb)];
        break;
      }

      // required Enum b = 2;
      case 2: {
        message.b = exports.decodeEnum[readVarint32(bb)];
        break;
      }

      // repeated Enum c = 3;
      case 3: {
        var values = message.c || (message.c = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(exports.decodeEnum[readVarint32(bb)]);
          }
          bb.limit = outerLimit;
        } else {
          values.push(exports.decodeEnum[readVarint32(bb)]);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.b === undefined)
    throw new Error("Missing required field: b");

  return message;
};

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

var utf8Decoder = new TextDecoder();
var utf8Encoder = new TextEncoder();

var f32 = new Float32Array(1);
var f32_u8 = new Uint8Array(f32.buffer);

var f64 = new Float64Array(1);
var f64_u8 = new Uint8Array(f64.buffer);

function intToLong(value) {
  value |= 0;
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0,
  };
}

function newByteBuffer(bytes) {
  if (bytes) {
    return { bytes, offset: 0, limit: bytes.length };
  } else {
    return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  }
}

function toUint8Array(bb) {
  var bytes = bb.bytes;
  var limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip(bb, offset) {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb) {
  return bb.offset >= bb.limit;
}

function grow(bb, count) {
  var bytes = bb.bytes;
  var offset = bb.offset;
  var limit = bb.limit;
  var finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    var newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

function advance(bb, count) {
  var offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb, count) {
  var offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb, buffer) {
  var offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readByte(bb) {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb, value) {
  var offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb) {
  var offset = advance(bb, 4);
  f32_u8.set(bb.bytes.subarray(offset, offset + 4));
  return f32[0];
}

function writeFloat(bb, value) {
  var offset = grow(bb, 4);
  f32[0] = value;
  bb.bytes.set(f32_u8, offset);
}

function readDouble(bb) {
  var offset = advance(bb, 8);
  f64_u8.set(bb.bytes.subarray(offset, offset + 8));
  return f64[0];
}

function writeDouble(bb, value) {
  var offset = grow(bb, 8);
  f64[0] = value;
  bb.bytes.set(f64_u8, offset);
}

function readInt32(bb) {
  var offset = advance(bb, 4);
  var bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb, value) {
  var offset = grow(bb, 4);
  var bytes = bb.bytes;
  bytes[offset] = value;
  bytes[offset + 1] = value >> 8;
  bytes[offset + 2] = value >> 16;
  bytes[offset + 3] = value >> 24;
}

function readInt64(bb, unsigned) {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned,
  };
}

function writeInt64(bb, value) {
  writeInt32(bb, value.low);
  writeInt32(bb, value.high);
}

function readVarint32(bb) {
  var c = 0;
  var value = 0;
  var b;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7F) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}

function writeVarint32(bb, value) {
  value >>>= 0;
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80);
    value >>>= 7;
  }
  writeByte(bb, value);
}

function readVarint64(bb, unsigned) {
  var part0 = 0;
  var part1 = 0;
  var part2 = 0;
  var b;

  b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
    b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
      b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

          b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
            b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
              b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                  b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                    b = readByte(bb); part2 |= (b & 0x7F) << 7;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned,
  };
}

function writeVarint64(bb, value) {
  var part0 = value.low >>> 0;
  var part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  var part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  var size =
    part2 === 0 ?
      part1 === 0 ?
        part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
          part0 < 1 << 21 ? 3 : 4 :
        part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
          part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

  var offset = grow(bb, size);
  var bytes = bb.bytes;

  switch (size) {
    case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
    case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
    case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
    case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
    case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
    case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
    case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
    case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
    case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
    case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
  }
}

function readVarint32ZigZag(bb) {
  var value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb, value) {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb) {
  var value = readVarint64(bb, /* unsigned */ false);
  var low = value.low;
  var high = value.high;
  var flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb, value) {
  var low = value.low;
  var high = value.high;
  var flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}
