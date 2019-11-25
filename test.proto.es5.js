exports.encodeEnum = {
  A: 0,
  B: 1,
};

exports.decodeEnum = {
  0: "A",
  1: "B",
};

exports.encodeNested = function (message) {
  var bb = popByteBuffer();
  _encodeNested(message, bb);
  return toUint8Array(bb);
}

function _encodeNested(message, bb) {
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
};

exports.decodeNested = function (binary) {
  return _decodeNested(wrapByteBuffer(binary));
}

function _decodeNested(bb) {
  var message = {};

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
  var bb = popByteBuffer();
  _encodeOptional(message, bb);
  return toUint8Array(bb);
}

function _encodeOptional(message, bb) {
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
    writeString(bb, $field_string);
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
    var nested = popByteBuffer();
    _encodeNested($field_nested, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
};

exports.decodeOptional = function (binary) {
  return _decodeOptional(wrapByteBuffer(binary));
}

function _decodeOptional(bb) {
  var message = {};

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
        message.field_string = readString(bb, readVarint32(bb));
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
        message.field_nested = _decodeNested(bb);
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
  var bb = popByteBuffer();
  _encodeRepeatedUnpacked(message, bb);
  return toUint8Array(bb);
}

function _encodeRepeatedUnpacked(message, bb) {
  // repeated int32 field_int32 = 1;
  var array$field_int32 = message.field_int32;
  if (array$field_int32 !== undefined) {
    for (var i = 0; i < array$field_int32.length; i++) {
      var value = array$field_int32[i];
      writeVarint32(bb, 8);
      writeVarint64(bb, intToLong(value));
    }
  }

  // repeated int64 field_int64 = 2;
  var array$field_int64 = message.field_int64;
  if (array$field_int64 !== undefined) {
    for (var i = 0; i < array$field_int64.length; i++) {
      var value = array$field_int64[i];
      writeVarint32(bb, 16);
      writeVarint64(bb, value);
    }
  }

  // repeated uint32 field_uint32 = 3;
  var array$field_uint32 = message.field_uint32;
  if (array$field_uint32 !== undefined) {
    for (var i = 0; i < array$field_uint32.length; i++) {
      var value = array$field_uint32[i];
      writeVarint32(bb, 24);
      writeVarint32(bb, value);
    }
  }

  // repeated uint64 field_uint64 = 4;
  var array$field_uint64 = message.field_uint64;
  if (array$field_uint64 !== undefined) {
    for (var i = 0; i < array$field_uint64.length; i++) {
      var value = array$field_uint64[i];
      writeVarint32(bb, 32);
      writeVarint64(bb, value);
    }
  }

  // repeated sint32 field_sint32 = 5;
  var array$field_sint32 = message.field_sint32;
  if (array$field_sint32 !== undefined) {
    for (var i = 0; i < array$field_sint32.length; i++) {
      var value = array$field_sint32[i];
      writeVarint32(bb, 40);
      writeVarint32ZigZag(bb, value);
    }
  }

  // repeated sint64 field_sint64 = 6;
  var array$field_sint64 = message.field_sint64;
  if (array$field_sint64 !== undefined) {
    for (var i = 0; i < array$field_sint64.length; i++) {
      var value = array$field_sint64[i];
      writeVarint32(bb, 48);
      writeVarint64ZigZag(bb, value);
    }
  }

  // repeated bool field_bool = 7;
  var array$field_bool = message.field_bool;
  if (array$field_bool !== undefined) {
    for (var i = 0; i < array$field_bool.length; i++) {
      var value = array$field_bool[i];
      writeVarint32(bb, 56);
      writeByte(bb, value ? 1 : 0);
    }
  }

  // repeated fixed64 field_fixed64 = 8;
  var array$field_fixed64 = message.field_fixed64;
  if (array$field_fixed64 !== undefined) {
    for (var i = 0; i < array$field_fixed64.length; i++) {
      var value = array$field_fixed64[i];
      writeVarint32(bb, 65);
      writeInt64(bb, value);
    }
  }

  // repeated sfixed64 field_sfixed64 = 9;
  var array$field_sfixed64 = message.field_sfixed64;
  if (array$field_sfixed64 !== undefined) {
    for (var i = 0; i < array$field_sfixed64.length; i++) {
      var value = array$field_sfixed64[i];
      writeVarint32(bb, 73);
      writeInt64(bb, value);
    }
  }

  // repeated double field_double = 10;
  var array$field_double = message.field_double;
  if (array$field_double !== undefined) {
    for (var i = 0; i < array$field_double.length; i++) {
      var value = array$field_double[i];
      writeVarint32(bb, 81);
      writeDouble(bb, value);
    }
  }

  // repeated string field_string = 11;
  var array$field_string = message.field_string;
  if (array$field_string !== undefined) {
    for (var i = 0; i < array$field_string.length; i++) {
      var value = array$field_string[i];
      writeVarint32(bb, 90);
      writeString(bb, value);
    }
  }

  // repeated bytes field_bytes = 12;
  var array$field_bytes = message.field_bytes;
  if (array$field_bytes !== undefined) {
    for (var i = 0; i < array$field_bytes.length; i++) {
      var value = array$field_bytes[i];
      writeVarint32(bb, 98);
      writeVarint32(bb, value.length), writeBytes(bb, value);
    }
  }

  // repeated fixed32 field_fixed32 = 13;
  var array$field_fixed32 = message.field_fixed32;
  if (array$field_fixed32 !== undefined) {
    for (var i = 0; i < array$field_fixed32.length; i++) {
      var value = array$field_fixed32[i];
      writeVarint32(bb, 109);
      writeInt32(bb, value);
    }
  }

  // repeated sfixed32 field_sfixed32 = 14;
  var array$field_sfixed32 = message.field_sfixed32;
  if (array$field_sfixed32 !== undefined) {
    for (var i = 0; i < array$field_sfixed32.length; i++) {
      var value = array$field_sfixed32[i];
      writeVarint32(bb, 117);
      writeInt32(bb, value);
    }
  }

  // repeated float field_float = 15;
  var array$field_float = message.field_float;
  if (array$field_float !== undefined) {
    for (var i = 0; i < array$field_float.length; i++) {
      var value = array$field_float[i];
      writeVarint32(bb, 125);
      writeFloat(bb, value);
    }
  }

  // repeated Nested field_nested = 16;
  var array$field_nested = message.field_nested;
  if (array$field_nested !== undefined) {
    for (var i = 0; i < array$field_nested.length; i++) {
      var value = array$field_nested[i];
      writeVarint32(bb, 130);
      var nested = popByteBuffer();
      _encodeNested(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeRepeatedUnpacked = function (binary) {
  return _decodeRepeatedUnpacked(wrapByteBuffer(binary));
}

function _decodeRepeatedUnpacked(bb) {
  var message = {};

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
        values.push(readString(bb, readVarint32(bb)));
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
        values.push(_decodeNested(bb));
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
  var bb = popByteBuffer();
  _encodeRepeatedPacked(message, bb);
  return toUint8Array(bb);
}

function _encodeRepeatedPacked(message, bb) {
  // repeated int32 field_int32 = 1;
  var array$field_int32 = message.field_int32;
  if (array$field_int32 !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_int32.length; i++) {
      var value = array$field_int32[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated int64 field_int64 = 2;
  var array$field_int64 = message.field_int64;
  if (array$field_int64 !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_int64.length; i++) {
      var value = array$field_int64[i];
      writeVarint64(packed, value);
    }
    writeVarint32(bb, 18);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 field_uint32 = 3;
  var array$field_uint32 = message.field_uint32;
  if (array$field_uint32 !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_uint32.length; i++) {
      var value = array$field_uint32[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint64 field_uint64 = 4;
  var array$field_uint64 = message.field_uint64;
  if (array$field_uint64 !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_uint64.length; i++) {
      var value = array$field_uint64[i];
      writeVarint64(packed, value);
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated sint32 field_sint32 = 5;
  var array$field_sint32 = message.field_sint32;
  if (array$field_sint32 !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_sint32.length; i++) {
      var value = array$field_sint32[i];
      writeVarint32ZigZag(packed, value);
    }
    writeVarint32(bb, 42);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated sint64 field_sint64 = 6;
  var array$field_sint64 = message.field_sint64;
  if (array$field_sint64 !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_sint64.length; i++) {
      var value = array$field_sint64[i];
      writeVarint64ZigZag(packed, value);
    }
    writeVarint32(bb, 50);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated bool field_bool = 7;
  var array$field_bool = message.field_bool;
  if (array$field_bool !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_bool.length; i++) {
      var value = array$field_bool[i];
      writeByte(packed, value ? 1 : 0);
    }
    writeVarint32(bb, 58);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated fixed64 field_fixed64 = 8;
  var array$field_fixed64 = message.field_fixed64;
  if (array$field_fixed64 !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_fixed64.length; i++) {
      var value = array$field_fixed64[i];
      writeInt64(packed, value);
    }
    writeVarint32(bb, 66);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated sfixed64 field_sfixed64 = 9;
  var array$field_sfixed64 = message.field_sfixed64;
  if (array$field_sfixed64 !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_sfixed64.length; i++) {
      var value = array$field_sfixed64[i];
      writeInt64(packed, value);
    }
    writeVarint32(bb, 74);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated double field_double = 10;
  var array$field_double = message.field_double;
  if (array$field_double !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_double.length; i++) {
      var value = array$field_double[i];
      writeDouble(packed, value);
    }
    writeVarint32(bb, 82);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated string field_string = 11;
  var array$field_string = message.field_string;
  if (array$field_string !== undefined) {
    for (var i = 0; i < array$field_string.length; i++) {
      var value = array$field_string[i];
      writeVarint32(bb, 90);
      writeString(bb, value);
    }
  }

  // repeated bytes field_bytes = 12;
  var array$field_bytes = message.field_bytes;
  if (array$field_bytes !== undefined) {
    for (var i = 0; i < array$field_bytes.length; i++) {
      var value = array$field_bytes[i];
      writeVarint32(bb, 98);
      writeVarint32(bb, value.length), writeBytes(bb, value);
    }
  }

  // repeated fixed32 field_fixed32 = 13;
  var array$field_fixed32 = message.field_fixed32;
  if (array$field_fixed32 !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_fixed32.length; i++) {
      var value = array$field_fixed32[i];
      writeInt32(packed, value);
    }
    writeVarint32(bb, 106);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated sfixed32 field_sfixed32 = 14;
  var array$field_sfixed32 = message.field_sfixed32;
  if (array$field_sfixed32 !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_sfixed32.length; i++) {
      var value = array$field_sfixed32[i];
      writeInt32(packed, value);
    }
    writeVarint32(bb, 114);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated float field_float = 15;
  var array$field_float = message.field_float;
  if (array$field_float !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$field_float.length; i++) {
      var value = array$field_float[i];
      writeFloat(packed, value);
    }
    writeVarint32(bb, 122);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated Nested field_nested = 16;
  var array$field_nested = message.field_nested;
  if (array$field_nested !== undefined) {
    for (var i = 0; i < array$field_nested.length; i++) {
      var value = array$field_nested[i];
      writeVarint32(bb, 130);
      var nested = popByteBuffer();
      _encodeNested(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeRepeatedPacked = function (binary) {
  return _decodeRepeatedPacked(wrapByteBuffer(binary));
}

function _decodeRepeatedPacked(bb) {
  var message = {};

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
        values.push(readString(bb, readVarint32(bb)));
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
        values.push(_decodeNested(bb));
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
  var bb = popByteBuffer();
  _encodeEnumTest(message, bb);
  return toUint8Array(bb);
}

function _encodeEnumTest(message, bb) {
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
    var packed = popByteBuffer();
    for (var i = 0; i < array$c.length; i++) {
      var value = array$c[i];
      writeVarint32(packed, exports.encodeEnum[value]);
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeEnumTest = function (binary) {
  return _decodeEnumTest(wrapByteBuffer(binary));
}

function _decodeEnumTest(bb) {
  var message = {};

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

exports.encodeMapTestIntAndString = function (message) {
  var bb = popByteBuffer();
  _encodeMapTestIntAndString(message, bb);
  return toUint8Array(bb);
}

function _encodeMapTestIntAndString(message, bb) {
  // optional map<int32, string> field_int32 = 1;
  var map$field_int32 = message.field_int32;
  if (map$field_int32 !== undefined) {
    for (var key in map$field_int32) {
      var nested = popByteBuffer();
      var value = map$field_int32[key];
      writeVarint32(nested, 8);
      writeVarint64(nested, intToLong(+key));
      writeVarint32(nested, 18);
      writeString(nested, value);
      writeVarint32(bb, 10);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional map<uint32, bytes> field_uint32 = 2;
  var map$field_uint32 = message.field_uint32;
  if (map$field_uint32 !== undefined) {
    for (var key in map$field_uint32) {
      var nested = popByteBuffer();
      var value = map$field_uint32[key];
      writeVarint32(nested, 8);
      writeVarint32(nested, +key);
      writeVarint32(nested, 18);
      writeVarint32(nested, value.length), writeBytes(nested, value);
      writeVarint32(bb, 18);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional map<sint32, int64> field_sint32 = 3;
  var map$field_sint32 = message.field_sint32;
  if (map$field_sint32 !== undefined) {
    for (var key in map$field_sint32) {
      var nested = popByteBuffer();
      var value = map$field_sint32[key];
      writeVarint32(nested, 8);
      writeVarint32ZigZag(nested, +key);
      writeVarint32(nested, 16);
      writeVarint64(nested, value);
      writeVarint32(bb, 26);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional map<string, double> field_string = 5;
  var map$field_string = message.field_string;
  if (map$field_string !== undefined) {
    for (var key in map$field_string) {
      var nested = popByteBuffer();
      var value = map$field_string[key];
      writeVarint32(nested, 10);
      writeString(nested, key);
      writeVarint32(nested, 17);
      writeDouble(nested, value);
      writeVarint32(bb, 42);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional map<fixed32, bool> field_fixed32 = 6;
  var map$field_fixed32 = message.field_fixed32;
  if (map$field_fixed32 !== undefined) {
    for (var key in map$field_fixed32) {
      var nested = popByteBuffer();
      var value = map$field_fixed32[key];
      writeVarint32(nested, 13);
      writeInt32(nested, +key);
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 50);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional map<sfixed32, Nested> field_sfixed32 = 7;
  var map$field_sfixed32 = message.field_sfixed32;
  if (map$field_sfixed32 !== undefined) {
    for (var key in map$field_sfixed32) {
      var nested = popByteBuffer();
      var value = map$field_sfixed32[key];
      writeVarint32(nested, 13);
      writeInt32(nested, +key);
      writeVarint32(nested, 18);
      var nestedValue = popByteBuffer();
      _encodeNested(value, nestedValue);
      writeVarint32(nested, nestedValue.limit);
      writeByteBuffer(nested, nestedValue);
      pushByteBuffer(nestedValue);
      writeVarint32(bb, 58);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeMapTestIntAndString = function (binary) {
  return _decodeMapTestIntAndString(wrapByteBuffer(binary));
}

function _decodeMapTestIntAndString(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional map<int32, string> field_int32 = 1;
      case 1: {
        var values = message.field_int32 || (message.field_int32 = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readVarint32(bb);
              break;
            }
            case 2: {
              value = readString(bb, readVarint32(bb));
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: field_int32");
        values[key] = value;
        bb.limit = outerLimit;
        break;
      }

      // optional map<uint32, bytes> field_uint32 = 2;
      case 2: {
        var values = message.field_uint32 || (message.field_uint32 = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readVarint32(bb) >>> 0;
              break;
            }
            case 2: {
              value = readBytes(bb, readVarint32(bb));
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: field_uint32");
        values[key] = value;
        bb.limit = outerLimit;
        break;
      }

      // optional map<sint32, int64> field_sint32 = 3;
      case 3: {
        var values = message.field_sint32 || (message.field_sint32 = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readVarint32ZigZag(bb);
              break;
            }
            case 2: {
              value = readVarint64(bb, /* unsigned */ false);
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: field_sint32");
        values[key] = value;
        bb.limit = outerLimit;
        break;
      }

      // optional map<string, double> field_string = 5;
      case 5: {
        var values = message.field_string || (message.field_string = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readString(bb, readVarint32(bb));
              break;
            }
            case 2: {
              value = readDouble(bb);
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: field_string");
        values[key] = value;
        bb.limit = outerLimit;
        break;
      }

      // optional map<fixed32, bool> field_fixed32 = 6;
      case 6: {
        var values = message.field_fixed32 || (message.field_fixed32 = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readInt32(bb) >>> 0;
              break;
            }
            case 2: {
              value = !!readByte(bb);
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: field_fixed32");
        values[key] = value;
        bb.limit = outerLimit;
        break;
      }

      // optional map<sfixed32, Nested> field_sfixed32 = 7;
      case 7: {
        var values = message.field_sfixed32 || (message.field_sfixed32 = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readInt32(bb);
              break;
            }
            case 2: {
              var valueLimit = pushTemporaryLength(bb);
              value = _decodeNested(bb);
              bb.limit = valueLimit;
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: field_sfixed32");
        values[key] = value;
        bb.limit = outerLimit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeMapTestLongAndBool = function (message) {
  var bb = popByteBuffer();
  _encodeMapTestLongAndBool(message, bb);
  return toUint8Array(bb);
}

function _encodeMapTestLongAndBool(message, bb) {
  // optional map<int64, string> field_int64 = 1;
  var map$field_int64 = message.field_int64;
  if (map$field_int64 !== undefined) {
    for (var key in map$field_int64) {
      var nested = popByteBuffer();
      var value = map$field_int64[key];
      writeVarint32(nested, 8);
      writeVarint64(nested, stringToLong(key));
      writeVarint32(nested, 18);
      writeString(nested, value);
      writeVarint32(bb, 10);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional map<uint64, bytes> field_uint64 = 2;
  var map$field_uint64 = message.field_uint64;
  if (map$field_uint64 !== undefined) {
    for (var key in map$field_uint64) {
      var nested = popByteBuffer();
      var value = map$field_uint64[key];
      writeVarint32(nested, 8);
      writeVarint64(nested, stringToLong(key));
      writeVarint32(nested, 18);
      writeVarint32(nested, value.length), writeBytes(nested, value);
      writeVarint32(bb, 18);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional map<sint64, int64> field_sint64 = 3;
  var map$field_sint64 = message.field_sint64;
  if (map$field_sint64 !== undefined) {
    for (var key in map$field_sint64) {
      var nested = popByteBuffer();
      var value = map$field_sint64[key];
      writeVarint32(nested, 8);
      writeVarint64ZigZag(nested, stringToLong(key));
      writeVarint32(nested, 16);
      writeVarint64(nested, value);
      writeVarint32(bb, 26);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional map<fixed64, double> field_fixed64 = 4;
  var map$field_fixed64 = message.field_fixed64;
  if (map$field_fixed64 !== undefined) {
    for (var key in map$field_fixed64) {
      var nested = popByteBuffer();
      var value = map$field_fixed64[key];
      writeVarint32(nested, 9);
      writeInt64(nested, stringToLong(key));
      writeVarint32(nested, 17);
      writeDouble(nested, value);
      writeVarint32(bb, 34);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional map<sfixed64, bool> field_sfixed64 = 5;
  var map$field_sfixed64 = message.field_sfixed64;
  if (map$field_sfixed64 !== undefined) {
    for (var key in map$field_sfixed64) {
      var nested = popByteBuffer();
      var value = map$field_sfixed64[key];
      writeVarint32(nested, 9);
      writeInt64(nested, stringToLong(key));
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 42);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional map<bool, Nested> field_bool = 6;
  var map$field_bool = message.field_bool;
  if (map$field_bool !== undefined) {
    for (var key in map$field_bool) {
      var nested = popByteBuffer();
      var value = map$field_bool[key];
      writeVarint32(nested, 8);
      writeByte(nested, key === "true" ? 1 : 0);
      writeVarint32(nested, 18);
      var nestedValue = popByteBuffer();
      _encodeNested(value, nestedValue);
      writeVarint32(nested, nestedValue.limit);
      writeByteBuffer(nested, nestedValue);
      pushByteBuffer(nestedValue);
      writeVarint32(bb, 50);
      writeVarint32(bb, nested.offset);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeMapTestLongAndBool = function (binary) {
  return _decodeMapTestLongAndBool(wrapByteBuffer(binary));
}

function _decodeMapTestLongAndBool(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional map<int64, string> field_int64 = 1;
      case 1: {
        var values = message.field_int64 || (message.field_int64 = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readVarint64(bb, /* unsigned */ false);
              break;
            }
            case 2: {
              value = readString(bb, readVarint32(bb));
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: field_int64");
        values[longToString(key)] = value;
        bb.limit = outerLimit;
        break;
      }

      // optional map<uint64, bytes> field_uint64 = 2;
      case 2: {
        var values = message.field_uint64 || (message.field_uint64 = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readVarint64(bb, /* unsigned */ true);
              break;
            }
            case 2: {
              value = readBytes(bb, readVarint32(bb));
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: field_uint64");
        values[longToString(key)] = value;
        bb.limit = outerLimit;
        break;
      }

      // optional map<sint64, int64> field_sint64 = 3;
      case 3: {
        var values = message.field_sint64 || (message.field_sint64 = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readVarint64ZigZag(bb);
              break;
            }
            case 2: {
              value = readVarint64(bb, /* unsigned */ false);
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: field_sint64");
        values[longToString(key)] = value;
        bb.limit = outerLimit;
        break;
      }

      // optional map<fixed64, double> field_fixed64 = 4;
      case 4: {
        var values = message.field_fixed64 || (message.field_fixed64 = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readInt64(bb, /* unsigned */ true);
              break;
            }
            case 2: {
              value = readDouble(bb);
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: field_fixed64");
        values[longToString(key)] = value;
        bb.limit = outerLimit;
        break;
      }

      // optional map<sfixed64, bool> field_sfixed64 = 5;
      case 5: {
        var values = message.field_sfixed64 || (message.field_sfixed64 = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = readInt64(bb, /* unsigned */ false);
              break;
            }
            case 2: {
              value = !!readByte(bb);
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: field_sfixed64");
        values[longToString(key)] = value;
        bb.limit = outerLimit;
        break;
      }

      // optional map<bool, Nested> field_bool = 6;
      case 6: {
        var values = message.field_bool || (message.field_bool = {});
        var outerLimit = pushTemporaryLength(bb);
        var key;
        var value;
        end_of_entry: while (!isAtEnd(bb)) {
          var tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1: {
              key = !!readByte(bb);
              break;
            }
            case 2: {
              var valueLimit = pushTemporaryLength(bb);
              value = _decodeNested(bb);
              bb.limit = valueLimit;
              break;
            }
            default:
              skipUnknownField(bb, tag & 7);
          }
        }
        if (key === undefined || value === undefined)
          throw new Error("Invalid data for map: field_bool");
        values[key + ''] = value;
        bb.limit = outerLimit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

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

function stringToLong(value) {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false,
  };
}

function longToString(value) {
  var low = value.low;
  var high = value.high;
  return String.fromCharCode(
    low & 0xFFFF,
    low >>> 16,
    high & 0xFFFF,
    high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

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

var bbStack = [];

function popByteBuffer() {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

function pushByteBuffer(bb) {
  bbStack.push(bb);
}

function wrapByteBuffer(bytes) {
  return { bytes, offset: 0, limit: bytes.length };
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

function readString(bb, count) {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  var offset = advance(bb, count);
  var fromCharCode = String.fromCharCode;
  var bytes = bb.bytes;
  var invalid = '\uFFFD';
  var text = '';

  for (var i = 0; i < count; i++) {
    var c1 = bytes[i + offset], c2, c3, c4, c;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xE0) === 0xC0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xC0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xF0) == 0xE0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xF8) == 0xF0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
          if (c < 0x10000 || c > 0x10FFFF) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
            i += 3;
          }
        }
      }
    }

    else text += invalid;
  }

  return text;
}

function writeString(bb, text) {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  var n = text.length;
  var byteCount = 0;

  // Write the byte count first
  for (var i = 0; i < n; i++) {
    var c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  writeVarint32(bb, byteCount);

  var offset = grow(bb, byteCount);
  var bytes = bb.bytes;

  // Then write the bytes
  for (var i = 0; i < n; i++) {
    var c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    if (c < 0x80) {
      bytes[offset++] = c;
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
          bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
        }
        bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
      }
      bytes[offset++] = (c & 0x3F) | 0x80;
    }
  }
}

function writeByteBuffer(bb, buffer) {
  var offset = grow(bb, buffer.limit);
  var from = bb.bytes;
  var to = buffer.bytes;

  // This for loop is much faster than subarray+set on V8
  for (var i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i];
  }
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
  var bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++];
  f32_u8[1] = bytes[offset++];
  f32_u8[2] = bytes[offset++];
  f32_u8[3] = bytes[offset++];
  return f32[0];
}

function writeFloat(bb, value) {
  var offset = grow(bb, 4);
  var bytes = bb.bytes;
  f32[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0];
  bytes[offset++] = f32_u8[1];
  bytes[offset++] = f32_u8[2];
  bytes[offset++] = f32_u8[3];
}

function readDouble(bb) {
  var offset = advance(bb, 8);
  var bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++];
  f64_u8[1] = bytes[offset++];
  f64_u8[2] = bytes[offset++];
  f64_u8[3] = bytes[offset++];
  f64_u8[4] = bytes[offset++];
  f64_u8[5] = bytes[offset++];
  f64_u8[6] = bytes[offset++];
  f64_u8[7] = bytes[offset++];
  return f64[0];
}

function writeDouble(bb, value) {
  var offset = grow(bb, 8);
  var bytes = bb.bytes;
  f64[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0];
  bytes[offset++] = f64_u8[1];
  bytes[offset++] = f64_u8[2];
  bytes[offset++] = f64_u8[3];
  bytes[offset++] = f64_u8[4];
  bytes[offset++] = f64_u8[5];
  bytes[offset++] = f64_u8[6];
  bytes[offset++] = f64_u8[7];
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
