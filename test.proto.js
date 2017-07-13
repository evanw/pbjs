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

  test["encodeNested"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // optional float x = 1;
    var value = message["x"];
    if (value !== undefined) {
      buffer.writeVarint32(13);
      buffer.writeFloat(value);
    }

    // optional float y = 2;
    var value = message["y"];
    if (value !== undefined) {
      buffer.writeVarint32(21);
      buffer.writeFloat(value);
    }

    return buffer.flip().toBuffer();
  };

  test["decodeNested"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional float x = 1;
      case 1:
        message["x"] = buffer.readFloat();
        break;

      // optional float y = 2;
      case 2:
        message["y"] = buffer.readFloat();
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

  test["encodeOptional"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // optional int32 field_int32 = 1;
    var value = message["field_int32"];
    if (value !== undefined) {
      buffer.writeVarint32(8);
      buffer.writeVarint64(value | 0);
    }

    // optional int64 field_int64 = 2;
    var value = message["field_int64"];
    if (value !== undefined) {
      buffer.writeVarint32(16);
      buffer.writeVarint64(coerceLong(value));
    }

    // optional uint32 field_uint32 = 3;
    var value = message["field_uint32"];
    if (value !== undefined) {
      buffer.writeVarint32(24);
      buffer.writeVarint32(value);
    }

    // optional uint64 field_uint64 = 4;
    var value = message["field_uint64"];
    if (value !== undefined) {
      buffer.writeVarint32(32);
      buffer.writeVarint64(coerceLong(value));
    }

    // optional sint32 field_sint32 = 5;
    var value = message["field_sint32"];
    if (value !== undefined) {
      buffer.writeVarint32(40);
      buffer.writeVarint32ZigZag(value);
    }

    // optional sint64 field_sint64 = 6;
    var value = message["field_sint64"];
    if (value !== undefined) {
      buffer.writeVarint32(48);
      buffer.writeVarint64ZigZag(coerceLong(value));
    }

    // optional bool field_bool = 7;
    var value = message["field_bool"];
    if (value !== undefined) {
      buffer.writeVarint32(56);
      buffer.writeByte(value ? 1 : 0);
    }

    // optional fixed64 field_fixed64 = 8;
    var value = message["field_fixed64"];
    if (value !== undefined) {
      buffer.writeVarint32(65);
      buffer.writeUint64(coerceLong(value));
    }

    // optional sfixed64 field_sfixed64 = 9;
    var value = message["field_sfixed64"];
    if (value !== undefined) {
      buffer.writeVarint32(73);
      buffer.writeInt64(coerceLong(value));
    }

    // optional double field_double = 10;
    var value = message["field_double"];
    if (value !== undefined) {
      buffer.writeVarint32(81);
      buffer.writeDouble(value);
    }

    // optional string field_string = 11;
    var value = message["field_string"];
    if (value !== undefined) {
      buffer.writeVarint32(90);
      var nested = new ByteBuffer(undefined, true);
      nested.writeUTF8String(value), buffer.writeVarint32(nested.flip().limit), buffer.append(nested);
    }

    // optional bytes field_bytes = 12;
    var value = message["field_bytes"];
    if (value !== undefined) {
      buffer.writeVarint32(98);
      buffer.writeVarint32(value.length), buffer.append(value);
    }

    // optional fixed32 field_fixed32 = 13;
    var value = message["field_fixed32"];
    if (value !== undefined) {
      buffer.writeVarint32(109);
      buffer.writeUint32(value);
    }

    // optional sfixed32 field_sfixed32 = 14;
    var value = message["field_sfixed32"];
    if (value !== undefined) {
      buffer.writeVarint32(117);
      buffer.writeInt32(value);
    }

    // optional float field_float = 15;
    var value = message["field_float"];
    if (value !== undefined) {
      buffer.writeVarint32(125);
      buffer.writeFloat(value);
    }

    // optional Nested field_nested = 16;
    var value = message["field_nested"];
    if (value !== undefined) {
      buffer.writeVarint32(130);
      var nested = test["encodeNested"](value);
      buffer.writeVarint32(nested.byteLength), buffer.append(nested);
    }

    return buffer.flip().toBuffer();
  };

  test["decodeOptional"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional int32 field_int32 = 1;
      case 1:
        message["field_int32"] = buffer.readVarint32();
        break;

      // optional int64 field_int64 = 2;
      case 2:
        message["field_int64"] = buffer.readVarint64();
        break;

      // optional uint32 field_uint32 = 3;
      case 3:
        message["field_uint32"] = buffer.readVarint32() >>> 0;
        break;

      // optional uint64 field_uint64 = 4;
      case 4:
        message["field_uint64"] = buffer.readVarint64().toUnsigned();
        break;

      // optional sint32 field_sint32 = 5;
      case 5:
        message["field_sint32"] = buffer.readVarint32ZigZag();
        break;

      // optional sint64 field_sint64 = 6;
      case 6:
        message["field_sint64"] = buffer.readVarint64ZigZag();
        break;

      // optional bool field_bool = 7;
      case 7:
        message["field_bool"] = !!buffer.readByte();
        break;

      // optional fixed64 field_fixed64 = 8;
      case 8:
        message["field_fixed64"] = buffer.readUint64();
        break;

      // optional sfixed64 field_sfixed64 = 9;
      case 9:
        message["field_sfixed64"] = buffer.readInt64();
        break;

      // optional double field_double = 10;
      case 10:
        message["field_double"] = buffer.readDouble();
        break;

      // optional string field_string = 11;
      case 11:
        message["field_string"] = buffer.readUTF8String(buffer.readVarint32(), "b");
        break;

      // optional bytes field_bytes = 12;
      case 12:
        message["field_bytes"] = buffer.readBytes(buffer.readVarint32()).toBuffer();
        break;

      // optional fixed32 field_fixed32 = 13;
      case 13:
        message["field_fixed32"] = buffer.readUint32();
        break;

      // optional sfixed32 field_sfixed32 = 14;
      case 14:
        message["field_sfixed32"] = buffer.readInt32();
        break;

      // optional float field_float = 15;
      case 15:
        message["field_float"] = buffer.readFloat();
        break;

      // optional Nested field_nested = 16;
      case 16:
        var limit = pushTemporaryLength(buffer);
        message["field_nested"] = test["decodeNested"](buffer);
        buffer.limit = limit;
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

  test["encodeRepeatedUnpacked"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // repeated int32 field_int32 = 1;
    var values = message["field_int32"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(8);
        buffer.writeVarint64(value | 0);
      }
    }

    // repeated int64 field_int64 = 2;
    var values = message["field_int64"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(16);
        buffer.writeVarint64(coerceLong(value));
      }
    }

    // repeated uint32 field_uint32 = 3;
    var values = message["field_uint32"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(24);
        buffer.writeVarint32(value);
      }
    }

    // repeated uint64 field_uint64 = 4;
    var values = message["field_uint64"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(32);
        buffer.writeVarint64(coerceLong(value));
      }
    }

    // repeated sint32 field_sint32 = 5;
    var values = message["field_sint32"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(40);
        buffer.writeVarint32ZigZag(value);
      }
    }

    // repeated sint64 field_sint64 = 6;
    var values = message["field_sint64"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(48);
        buffer.writeVarint64ZigZag(coerceLong(value));
      }
    }

    // repeated bool field_bool = 7;
    var values = message["field_bool"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(56);
        buffer.writeByte(value ? 1 : 0);
      }
    }

    // repeated fixed64 field_fixed64 = 8;
    var values = message["field_fixed64"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(65);
        buffer.writeUint64(coerceLong(value));
      }
    }

    // repeated sfixed64 field_sfixed64 = 9;
    var values = message["field_sfixed64"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(73);
        buffer.writeInt64(coerceLong(value));
      }
    }

    // repeated double field_double = 10;
    var values = message["field_double"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(81);
        buffer.writeDouble(value);
      }
    }

    // repeated string field_string = 11;
    var values = message["field_string"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        var nested = new ByteBuffer(undefined, true);
        buffer.writeVarint32(90);
        nested.writeUTF8String(value), buffer.writeVarint32(nested.flip().limit), buffer.append(nested);
      }
    }

    // repeated bytes field_bytes = 12;
    var values = message["field_bytes"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(98);
        buffer.writeVarint32(value.length), buffer.append(value);
      }
    }

    // repeated fixed32 field_fixed32 = 13;
    var values = message["field_fixed32"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(109);
        buffer.writeUint32(value);
      }
    }

    // repeated sfixed32 field_sfixed32 = 14;
    var values = message["field_sfixed32"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(117);
        buffer.writeInt32(value);
      }
    }

    // repeated float field_float = 15;
    var values = message["field_float"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(125);
        buffer.writeFloat(value);
      }
    }

    // repeated Nested field_nested = 16;
    var values = message["field_nested"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        var nested = test["encodeNested"](value);
        buffer.writeVarint32(130);
        buffer.writeVarint32(nested.byteLength), buffer.append(nested);
      }
    }

    return buffer.flip().toBuffer();
  };

  test["decodeRepeatedUnpacked"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated int32 field_int32 = 1;
      case 1:
        var values = message["field_int32"] || (message["field_int32"] = []);
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

      // repeated int64 field_int64 = 2;
      case 2:
        var values = message["field_int64"] || (message["field_int64"] = []);
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

      // repeated uint32 field_uint32 = 3;
      case 3:
        var values = message["field_uint32"] || (message["field_uint32"] = []);
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

      // repeated uint64 field_uint64 = 4;
      case 4:
        var values = message["field_uint64"] || (message["field_uint64"] = []);
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

      // repeated sint32 field_sint32 = 5;
      case 5:
        var values = message["field_sint32"] || (message["field_sint32"] = []);
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

      // repeated sint64 field_sint64 = 6;
      case 6:
        var values = message["field_sint64"] || (message["field_sint64"] = []);
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

      // repeated bool field_bool = 7;
      case 7:
        var values = message["field_bool"] || (message["field_bool"] = []);
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

      // repeated fixed64 field_fixed64 = 8;
      case 8:
        var values = message["field_fixed64"] || (message["field_fixed64"] = []);
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

      // repeated sfixed64 field_sfixed64 = 9;
      case 9:
        var values = message["field_sfixed64"] || (message["field_sfixed64"] = []);
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

      // repeated double field_double = 10;
      case 10:
        var values = message["field_double"] || (message["field_double"] = []);
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

      // repeated string field_string = 11;
      case 11:
        var values = message["field_string"] || (message["field_string"] = []);
        values.push(buffer.readUTF8String(buffer.readVarint32(), "b"));
        break;

      // repeated bytes field_bytes = 12;
      case 12:
        var values = message["field_bytes"] || (message["field_bytes"] = []);
        values.push(buffer.readBytes(buffer.readVarint32()).toBuffer());
        break;

      // repeated fixed32 field_fixed32 = 13;
      case 13:
        var values = message["field_fixed32"] || (message["field_fixed32"] = []);
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

      // repeated sfixed32 field_sfixed32 = 14;
      case 14:
        var values = message["field_sfixed32"] || (message["field_sfixed32"] = []);
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

      // repeated float field_float = 15;
      case 15:
        var values = message["field_float"] || (message["field_float"] = []);
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

      // repeated Nested field_nested = 16;
      case 16:
        var limit = pushTemporaryLength(buffer);
        var values = message["field_nested"] || (message["field_nested"] = []);
        values.push(test["decodeNested"](buffer));
        buffer.limit = limit;
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

  test["encodeRepeatedPacked"] = function(message) {
    var buffer = new ByteBuffer(undefined, true);

    // repeated int32 field_int32 = 1;
    var values = message["field_int32"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeVarint64(value | 0);
      }
      buffer.writeVarint32(10);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated int64 field_int64 = 2;
    var values = message["field_int64"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeVarint64(coerceLong(value));
      }
      buffer.writeVarint32(18);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated uint32 field_uint32 = 3;
    var values = message["field_uint32"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeVarint32(value);
      }
      buffer.writeVarint32(26);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated uint64 field_uint64 = 4;
    var values = message["field_uint64"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeVarint64(coerceLong(value));
      }
      buffer.writeVarint32(34);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated sint32 field_sint32 = 5;
    var values = message["field_sint32"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeVarint32ZigZag(value);
      }
      buffer.writeVarint32(42);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated sint64 field_sint64 = 6;
    var values = message["field_sint64"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeVarint64ZigZag(coerceLong(value));
      }
      buffer.writeVarint32(50);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated bool field_bool = 7;
    var values = message["field_bool"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeByte(value ? 1 : 0);
      }
      buffer.writeVarint32(58);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated fixed64 field_fixed64 = 8;
    var values = message["field_fixed64"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeUint64(coerceLong(value));
      }
      buffer.writeVarint32(66);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated sfixed64 field_sfixed64 = 9;
    var values = message["field_sfixed64"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeInt64(coerceLong(value));
      }
      buffer.writeVarint32(74);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated double field_double = 10;
    var values = message["field_double"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeDouble(value);
      }
      buffer.writeVarint32(82);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated string field_string = 11;
    var values = message["field_string"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        var nested = new ByteBuffer(undefined, true);
        buffer.writeVarint32(90);
        nested.writeUTF8String(value), buffer.writeVarint32(nested.flip().limit), buffer.append(nested);
      }
    }

    // repeated bytes field_bytes = 12;
    var values = message["field_bytes"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        buffer.writeVarint32(98);
        buffer.writeVarint32(value.length), buffer.append(value);
      }
    }

    // repeated fixed32 field_fixed32 = 13;
    var values = message["field_fixed32"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeUint32(value);
      }
      buffer.writeVarint32(106);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated sfixed32 field_sfixed32 = 14;
    var values = message["field_sfixed32"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeInt32(value);
      }
      buffer.writeVarint32(114);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated float field_float = 15;
    var values = message["field_float"];
    if (values !== undefined) {
      var packed = new ByteBuffer(undefined, true)
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        packed.writeFloat(value);
      }
      buffer.writeVarint32(122);
      buffer.writeVarint32(packed.flip().limit);
      buffer.append(packed);
    }

    // repeated Nested field_nested = 16;
    var values = message["field_nested"];
    if (values !== undefined) {
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        var nested = test["encodeNested"](value);
        buffer.writeVarint32(130);
        buffer.writeVarint32(nested.byteLength), buffer.append(nested);
      }
    }

    return buffer.flip().toBuffer();
  };

  test["decodeRepeatedPacked"] = function(buffer) {
    var message = {};

    if (!(buffer instanceof ByteBuffer))
      buffer = new ByteBuffer.fromBinary(buffer, true);

    end_of_message: while (buffer.remaining() > 0) {
      var tag = buffer.readVarint32();

      switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated int32 field_int32 = 1;
      case 1:
        var values = message["field_int32"] || (message["field_int32"] = []);
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

      // repeated int64 field_int64 = 2;
      case 2:
        var values = message["field_int64"] || (message["field_int64"] = []);
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

      // repeated uint32 field_uint32 = 3;
      case 3:
        var values = message["field_uint32"] || (message["field_uint32"] = []);
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

      // repeated uint64 field_uint64 = 4;
      case 4:
        var values = message["field_uint64"] || (message["field_uint64"] = []);
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

      // repeated sint32 field_sint32 = 5;
      case 5:
        var values = message["field_sint32"] || (message["field_sint32"] = []);
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

      // repeated sint64 field_sint64 = 6;
      case 6:
        var values = message["field_sint64"] || (message["field_sint64"] = []);
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

      // repeated bool field_bool = 7;
      case 7:
        var values = message["field_bool"] || (message["field_bool"] = []);
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

      // repeated fixed64 field_fixed64 = 8;
      case 8:
        var values = message["field_fixed64"] || (message["field_fixed64"] = []);
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

      // repeated sfixed64 field_sfixed64 = 9;
      case 9:
        var values = message["field_sfixed64"] || (message["field_sfixed64"] = []);
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

      // repeated double field_double = 10;
      case 10:
        var values = message["field_double"] || (message["field_double"] = []);
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

      // repeated string field_string = 11;
      case 11:
        var values = message["field_string"] || (message["field_string"] = []);
        values.push(buffer.readUTF8String(buffer.readVarint32(), "b"));
        break;

      // repeated bytes field_bytes = 12;
      case 12:
        var values = message["field_bytes"] || (message["field_bytes"] = []);
        values.push(buffer.readBytes(buffer.readVarint32()).toBuffer());
        break;

      // repeated fixed32 field_fixed32 = 13;
      case 13:
        var values = message["field_fixed32"] || (message["field_fixed32"] = []);
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

      // repeated sfixed32 field_sfixed32 = 14;
      case 14:
        var values = message["field_sfixed32"] || (message["field_sfixed32"] = []);
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

      // repeated float field_float = 15;
      case 15:
        var values = message["field_float"] || (message["field_float"] = []);
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

      // repeated Nested field_nested = 16;
      case 16:
        var limit = pushTemporaryLength(buffer);
        var values = message["field_nested"] || (message["field_nested"] = []);
        values.push(test["decodeNested"](buffer));
        buffer.limit = limit;
        break;

      default:
        skipUnknownField(buffer, tag & 7);
      }
    }

    return message;
  };

})();
