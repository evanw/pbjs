export const encodeEnum = {
  A: 0,
  B: 1,
};

export const decodeEnum = {
  0: "A",
  1: "B",
};

export function encodeNested(message) {
  let bb = newByteBuffer();

  // optional float x = 1;
  let $x = message.x;
  if ($x !== undefined) {
    writeVarint32(bb, 13);
    writeFloat(bb, $x);
  }

  // optional float y = 2;
  let $y = message.y;
  if ($y !== undefined) {
    writeVarint32(bb, 21);
    writeFloat(bb, $y);
  }

  return toUint8Array(bb);
}

export function decodeNested(binary) {
  let message = {};
  let bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

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
}

export function encodeOptional(message) {
  let bb = newByteBuffer();

  // optional int32 field_int32 = 1;
  let $field_int32 = message.field_int32;
  if ($field_int32 !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, intToLong($field_int32));
  }

  // optional int64 field_int64 = 2;
  let $field_int64 = message.field_int64;
  if ($field_int64 !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, $field_int64);
  }

  // optional uint32 field_uint32 = 3;
  let $field_uint32 = message.field_uint32;
  if ($field_uint32 !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $field_uint32);
  }

  // optional uint64 field_uint64 = 4;
  let $field_uint64 = message.field_uint64;
  if ($field_uint64 !== undefined) {
    writeVarint32(bb, 32);
    writeVarint64(bb, $field_uint64);
  }

  // optional sint32 field_sint32 = 5;
  let $field_sint32 = message.field_sint32;
  if ($field_sint32 !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32ZigZag(bb, $field_sint32);
  }

  // optional sint64 field_sint64 = 6;
  let $field_sint64 = message.field_sint64;
  if ($field_sint64 !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64ZigZag(bb, $field_sint64);
  }

  // optional bool field_bool = 7;
  let $field_bool = message.field_bool;
  if ($field_bool !== undefined) {
    writeVarint32(bb, 56);
    writeByte(bb, $field_bool ? 1 : 0);
  }

  // optional fixed64 field_fixed64 = 8;
  let $field_fixed64 = message.field_fixed64;
  if ($field_fixed64 !== undefined) {
    writeVarint32(bb, 65);
    writeInt64(bb, $field_fixed64);
  }

  // optional sfixed64 field_sfixed64 = 9;
  let $field_sfixed64 = message.field_sfixed64;
  if ($field_sfixed64 !== undefined) {
    writeVarint32(bb, 73);
    writeInt64(bb, $field_sfixed64);
  }

  // optional double field_double = 10;
  let $field_double = message.field_double;
  if ($field_double !== undefined) {
    writeVarint32(bb, 81);
    writeDouble(bb, $field_double);
  }

  // optional string field_string = 11;
  let $field_string = message.field_string;
  if ($field_string !== undefined) {
    writeVarint32(bb, 90);
    let nested = utf8Encoder.encode($field_string);
    writeVarint32(bb, nested.length), writeBytes(bb, nested);
  }

  // optional bytes field_bytes = 12;
  let $field_bytes = message.field_bytes;
  if ($field_bytes !== undefined) {
    writeVarint32(bb, 98);
    writeVarint32(bb, $field_bytes.length), writeBytes(bb, $field_bytes);
  }

  // optional fixed32 field_fixed32 = 13;
  let $field_fixed32 = message.field_fixed32;
  if ($field_fixed32 !== undefined) {
    writeVarint32(bb, 109);
    writeInt32(bb, $field_fixed32);
  }

  // optional sfixed32 field_sfixed32 = 14;
  let $field_sfixed32 = message.field_sfixed32;
  if ($field_sfixed32 !== undefined) {
    writeVarint32(bb, 117);
    writeInt32(bb, $field_sfixed32);
  }

  // optional float field_float = 15;
  let $field_float = message.field_float;
  if ($field_float !== undefined) {
    writeVarint32(bb, 125);
    writeFloat(bb, $field_float);
  }

  // optional Nested field_nested = 16;
  let $field_nested = message.field_nested;
  if ($field_nested !== undefined) {
    writeVarint32(bb, 130);
    let nested = encodeNested($field_nested);
    writeVarint32(bb, nested.length), writeBytes(bb, nested);
  }

  return toUint8Array(bb);
}

export function decodeOptional(binary) {
  let message = {};
  let bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

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
        let limit = pushTemporaryLength(bb);
        message.field_nested = decodeNested(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function encodeRepeatedUnpacked(message) {
  let bb = newByteBuffer();

  // repeated int32 field_int32 = 1;
  let array$field_int32 = message.field_int32;
  if (array$field_int32 !== undefined) {
    for (let value of array$field_int32) {
      writeVarint32(bb, 8);
      writeVarint64(bb, intToLong(value));
    }
  }

  // repeated int64 field_int64 = 2;
  let array$field_int64 = message.field_int64;
  if (array$field_int64 !== undefined) {
    for (let value of array$field_int64) {
      writeVarint32(bb, 16);
      writeVarint64(bb, value);
    }
  }

  // repeated uint32 field_uint32 = 3;
  let array$field_uint32 = message.field_uint32;
  if (array$field_uint32 !== undefined) {
    for (let value of array$field_uint32) {
      writeVarint32(bb, 24);
      writeVarint32(bb, value);
    }
  }

  // repeated uint64 field_uint64 = 4;
  let array$field_uint64 = message.field_uint64;
  if (array$field_uint64 !== undefined) {
    for (let value of array$field_uint64) {
      writeVarint32(bb, 32);
      writeVarint64(bb, value);
    }
  }

  // repeated sint32 field_sint32 = 5;
  let array$field_sint32 = message.field_sint32;
  if (array$field_sint32 !== undefined) {
    for (let value of array$field_sint32) {
      writeVarint32(bb, 40);
      writeVarint32ZigZag(bb, value);
    }
  }

  // repeated sint64 field_sint64 = 6;
  let array$field_sint64 = message.field_sint64;
  if (array$field_sint64 !== undefined) {
    for (let value of array$field_sint64) {
      writeVarint32(bb, 48);
      writeVarint64ZigZag(bb, value);
    }
  }

  // repeated bool field_bool = 7;
  let array$field_bool = message.field_bool;
  if (array$field_bool !== undefined) {
    for (let value of array$field_bool) {
      writeVarint32(bb, 56);
      writeByte(bb, value ? 1 : 0);
    }
  }

  // repeated fixed64 field_fixed64 = 8;
  let array$field_fixed64 = message.field_fixed64;
  if (array$field_fixed64 !== undefined) {
    for (let value of array$field_fixed64) {
      writeVarint32(bb, 65);
      writeInt64(bb, value);
    }
  }

  // repeated sfixed64 field_sfixed64 = 9;
  let array$field_sfixed64 = message.field_sfixed64;
  if (array$field_sfixed64 !== undefined) {
    for (let value of array$field_sfixed64) {
      writeVarint32(bb, 73);
      writeInt64(bb, value);
    }
  }

  // repeated double field_double = 10;
  let array$field_double = message.field_double;
  if (array$field_double !== undefined) {
    for (let value of array$field_double) {
      writeVarint32(bb, 81);
      writeDouble(bb, value);
    }
  }

  // repeated string field_string = 11;
  let array$field_string = message.field_string;
  if (array$field_string !== undefined) {
    for (let value of array$field_string) {
      let nested = utf8Encoder.encode(value);
      writeVarint32(bb, 90);
      writeVarint32(bb, nested.length), writeBytes(bb, nested);
    }
  }

  // repeated bytes field_bytes = 12;
  let array$field_bytes = message.field_bytes;
  if (array$field_bytes !== undefined) {
    for (let value of array$field_bytes) {
      writeVarint32(bb, 98);
      writeVarint32(bb, value.length), writeBytes(bb, value);
    }
  }

  // repeated fixed32 field_fixed32 = 13;
  let array$field_fixed32 = message.field_fixed32;
  if (array$field_fixed32 !== undefined) {
    for (let value of array$field_fixed32) {
      writeVarint32(bb, 109);
      writeInt32(bb, value);
    }
  }

  // repeated sfixed32 field_sfixed32 = 14;
  let array$field_sfixed32 = message.field_sfixed32;
  if (array$field_sfixed32 !== undefined) {
    for (let value of array$field_sfixed32) {
      writeVarint32(bb, 117);
      writeInt32(bb, value);
    }
  }

  // repeated float field_float = 15;
  let array$field_float = message.field_float;
  if (array$field_float !== undefined) {
    for (let value of array$field_float) {
      writeVarint32(bb, 125);
      writeFloat(bb, value);
    }
  }

  // repeated Nested field_nested = 16;
  let array$field_nested = message.field_nested;
  if (array$field_nested !== undefined) {
    for (let value of array$field_nested) {
      let nested = encodeNested(value);
      writeVarint32(bb, 130);
      writeVarint32(bb, nested.length), writeBytes(bb, nested);
    }
  }

  return toUint8Array(bb);
}

export function decodeRepeatedUnpacked(binary) {
  let message = {};
  let bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated int32 field_int32 = 1;
      case 1: {
        let values = message.field_int32 || (message.field_int32 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_int64 || (message.field_int64 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_uint32 || (message.field_uint32 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_uint64 || (message.field_uint64 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_sint32 || (message.field_sint32 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_sint64 || (message.field_sint64 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_bool || (message.field_bool = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_fixed64 || (message.field_fixed64 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_sfixed64 || (message.field_sfixed64 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_double || (message.field_double = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_string || (message.field_string = []);
        values.push(utf8Decoder.decode(readBytes(bb, readVarint32(bb))));
        break;
      }

      // repeated bytes field_bytes = 12;
      case 12: {
        let values = message.field_bytes || (message.field_bytes = []);
        values.push(readBytes(bb, readVarint32(bb)));
        break;
      }

      // repeated fixed32 field_fixed32 = 13;
      case 13: {
        let values = message.field_fixed32 || (message.field_fixed32 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_sfixed32 || (message.field_sfixed32 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_float || (message.field_float = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let limit = pushTemporaryLength(bb);
        let values = message.field_nested || (message.field_nested = []);
        values.push(decodeNested(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function encodeRepeatedPacked(message) {
  let bb = newByteBuffer();

  // repeated int32 field_int32 = 1;
  let array$field_int32 = message.field_int32;
  if (array$field_int32 !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_int32) {
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated int64 field_int64 = 2;
  let array$field_int64 = message.field_int64;
  if (array$field_int64 !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_int64) {
      writeVarint64(packed, value);
    }
    writeVarint32(bb, 18);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated uint32 field_uint32 = 3;
  let array$field_uint32 = message.field_uint32;
  if (array$field_uint32 !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_uint32) {
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated uint64 field_uint64 = 4;
  let array$field_uint64 = message.field_uint64;
  if (array$field_uint64 !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_uint64) {
      writeVarint64(packed, value);
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated sint32 field_sint32 = 5;
  let array$field_sint32 = message.field_sint32;
  if (array$field_sint32 !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_sint32) {
      writeVarint32ZigZag(packed, value);
    }
    writeVarint32(bb, 42);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated sint64 field_sint64 = 6;
  let array$field_sint64 = message.field_sint64;
  if (array$field_sint64 !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_sint64) {
      writeVarint64ZigZag(packed, value);
    }
    writeVarint32(bb, 50);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated bool field_bool = 7;
  let array$field_bool = message.field_bool;
  if (array$field_bool !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_bool) {
      writeByte(packed, value ? 1 : 0);
    }
    writeVarint32(bb, 58);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated fixed64 field_fixed64 = 8;
  let array$field_fixed64 = message.field_fixed64;
  if (array$field_fixed64 !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_fixed64) {
      writeInt64(packed, value);
    }
    writeVarint32(bb, 66);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated sfixed64 field_sfixed64 = 9;
  let array$field_sfixed64 = message.field_sfixed64;
  if (array$field_sfixed64 !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_sfixed64) {
      writeInt64(packed, value);
    }
    writeVarint32(bb, 74);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated double field_double = 10;
  let array$field_double = message.field_double;
  if (array$field_double !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_double) {
      writeDouble(packed, value);
    }
    writeVarint32(bb, 82);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated string field_string = 11;
  let array$field_string = message.field_string;
  if (array$field_string !== undefined) {
    for (let value of array$field_string) {
      let nested = utf8Encoder.encode(value);
      writeVarint32(bb, 90);
      writeVarint32(bb, nested.length), writeBytes(bb, nested);
    }
  }

  // repeated bytes field_bytes = 12;
  let array$field_bytes = message.field_bytes;
  if (array$field_bytes !== undefined) {
    for (let value of array$field_bytes) {
      writeVarint32(bb, 98);
      writeVarint32(bb, value.length), writeBytes(bb, value);
    }
  }

  // repeated fixed32 field_fixed32 = 13;
  let array$field_fixed32 = message.field_fixed32;
  if (array$field_fixed32 !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_fixed32) {
      writeInt32(packed, value);
    }
    writeVarint32(bb, 106);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated sfixed32 field_sfixed32 = 14;
  let array$field_sfixed32 = message.field_sfixed32;
  if (array$field_sfixed32 !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_sfixed32) {
      writeInt32(packed, value);
    }
    writeVarint32(bb, 114);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated float field_float = 15;
  let array$field_float = message.field_float;
  if (array$field_float !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$field_float) {
      writeFloat(packed, value);
    }
    writeVarint32(bb, 122);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  // repeated Nested field_nested = 16;
  let array$field_nested = message.field_nested;
  if (array$field_nested !== undefined) {
    for (let value of array$field_nested) {
      let nested = encodeNested(value);
      writeVarint32(bb, 130);
      writeVarint32(bb, nested.length), writeBytes(bb, nested);
    }
  }

  return toUint8Array(bb);
}

export function decodeRepeatedPacked(binary) {
  let message = {};
  let bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated int32 field_int32 = 1;
      case 1: {
        let values = message.field_int32 || (message.field_int32 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_int64 || (message.field_int64 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_uint32 || (message.field_uint32 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_uint64 || (message.field_uint64 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_sint32 || (message.field_sint32 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_sint64 || (message.field_sint64 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_bool || (message.field_bool = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_fixed64 || (message.field_fixed64 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_sfixed64 || (message.field_sfixed64 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_double || (message.field_double = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_string || (message.field_string = []);
        values.push(utf8Decoder.decode(readBytes(bb, readVarint32(bb))));
        break;
      }

      // repeated bytes field_bytes = 12;
      case 12: {
        let values = message.field_bytes || (message.field_bytes = []);
        values.push(readBytes(bb, readVarint32(bb)));
        break;
      }

      // repeated fixed32 field_fixed32 = 13;
      case 13: {
        let values = message.field_fixed32 || (message.field_fixed32 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_sfixed32 || (message.field_sfixed32 = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let values = message.field_float || (message.field_float = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
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
        let limit = pushTemporaryLength(bb);
        let values = message.field_nested || (message.field_nested = []);
        values.push(decodeNested(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function encodeEnumTest(message) {
  let bb = newByteBuffer();

  // optional Enum a = 1;
  let $a = message.a;
  if ($a !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, encodeEnum[$a]);
  }

  // required Enum b = 2;
  let $b = message.b;
  if ($b !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, encodeEnum[$b]);
  }

  // repeated Enum c = 3;
  let array$c = message.c;
  if (array$c !== undefined) {
    let packed = newByteBuffer();
    for (let value of array$c) {
      writeVarint32(packed, encodeEnum[value]);
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeBytes(bb, toUint8Array(packed));
  }

  return toUint8Array(bb);
}

export function decodeEnumTest(binary) {
  let message = {};
  let bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional Enum a = 1;
      case 1: {
        message.a = decodeEnum[readVarint32(bb)];
        break;
      }

      // required Enum b = 2;
      case 2: {
        message.b = decodeEnum[readVarint32(bb)];
        break;
      }

      // repeated Enum c = 3;
      case 3: {
        let values = message.c || (message.c = []);
        if ((tag & 7) === 2) {
          let outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(decodeEnum[readVarint32(bb)]);
          }
          bb.limit = outerLimit;
        } else {
          values.push(decodeEnum[readVarint32(bb)]);
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
}

export function encodeMapTestIntAndString(message) {
  let bb = newByteBuffer();

  // optional map<int32, bool> field_int32 = 1;
  let map$field_int32 = message.field_int32;
  if (map$field_int32 !== undefined) {
    for (let key in map$field_int32) {
      let nested = newByteBuffer();
      let value = map$field_int32[key];
      writeVarint32(nested, 8);
      writeVarint64(nested, intToLong(+key));
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 10);
      writeVarint32(bb, nested.offset);
      writeBytes(bb, toUint8Array(nested));
    }
  }

  // optional map<uint32, bool> field_uint32 = 2;
  let map$field_uint32 = message.field_uint32;
  if (map$field_uint32 !== undefined) {
    for (let key in map$field_uint32) {
      let nested = newByteBuffer();
      let value = map$field_uint32[key];
      writeVarint32(nested, 8);
      writeVarint32(nested, +key);
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 18);
      writeVarint32(bb, nested.offset);
      writeBytes(bb, toUint8Array(nested));
    }
  }

  // optional map<sint32, bool> field_sint32 = 3;
  let map$field_sint32 = message.field_sint32;
  if (map$field_sint32 !== undefined) {
    for (let key in map$field_sint32) {
      let nested = newByteBuffer();
      let value = map$field_sint32[key];
      writeVarint32(nested, 8);
      writeVarint32ZigZag(nested, +key);
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 26);
      writeVarint32(bb, nested.offset);
      writeBytes(bb, toUint8Array(nested));
    }
  }

  // optional map<string, bool> field_string = 5;
  let map$field_string = message.field_string;
  if (map$field_string !== undefined) {
    for (let key in map$field_string) {
      let nested = newByteBuffer();
      let value = map$field_string[key];
      let nestedKey = utf8Encoder.encode(key);
      writeVarint32(nested, 10);
      writeVarint32(nested, nestedKey.length), writeBytes(nested, nestedKey);
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 42);
      writeVarint32(bb, nested.offset);
      writeBytes(bb, toUint8Array(nested));
    }
  }

  // optional map<fixed32, bool> field_fixed32 = 6;
  let map$field_fixed32 = message.field_fixed32;
  if (map$field_fixed32 !== undefined) {
    for (let key in map$field_fixed32) {
      let nested = newByteBuffer();
      let value = map$field_fixed32[key];
      writeVarint32(nested, 13);
      writeInt32(nested, +key);
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 50);
      writeVarint32(bb, nested.offset);
      writeBytes(bb, toUint8Array(nested));
    }
  }

  // optional map<sfixed32, bool> field_sfixed32 = 7;
  let map$field_sfixed32 = message.field_sfixed32;
  if (map$field_sfixed32 !== undefined) {
    for (let key in map$field_sfixed32) {
      let nested = newByteBuffer();
      let value = map$field_sfixed32[key];
      writeVarint32(nested, 13);
      writeInt32(nested, +key);
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 58);
      writeVarint32(bb, nested.offset);
      writeBytes(bb, toUint8Array(nested));
    }
  }

  return toUint8Array(bb);
}

export function decodeMapTestIntAndString(binary) {
  let message = {};
  let bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional map<int32, bool> field_int32 = 1;
      case 1: {
        let values = message.field_int32 || (message.field_int32 = {});
        let outerLimit = pushTemporaryLength(bb);
        let key;
        let value;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1:
              key = readVarint32(bb);
              break;
            case 2:
              value = !!readByte(bb);
              break;
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

      // optional map<uint32, bool> field_uint32 = 2;
      case 2: {
        let values = message.field_uint32 || (message.field_uint32 = {});
        let outerLimit = pushTemporaryLength(bb);
        let key;
        let value;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1:
              key = readVarint32(bb) >>> 0;
              break;
            case 2:
              value = !!readByte(bb);
              break;
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

      // optional map<sint32, bool> field_sint32 = 3;
      case 3: {
        let values = message.field_sint32 || (message.field_sint32 = {});
        let outerLimit = pushTemporaryLength(bb);
        let key;
        let value;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1:
              key = readVarint32ZigZag(bb);
              break;
            case 2:
              value = !!readByte(bb);
              break;
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

      // optional map<string, bool> field_string = 5;
      case 5: {
        let values = message.field_string || (message.field_string = {});
        let outerLimit = pushTemporaryLength(bb);
        let key;
        let value;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1:
              key = utf8Decoder.decode(readBytes(bb, readVarint32(bb)));
              break;
            case 2:
              value = !!readByte(bb);
              break;
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
        let values = message.field_fixed32 || (message.field_fixed32 = {});
        let outerLimit = pushTemporaryLength(bb);
        let key;
        let value;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1:
              key = readInt32(bb) >>> 0;
              break;
            case 2:
              value = !!readByte(bb);
              break;
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

      // optional map<sfixed32, bool> field_sfixed32 = 7;
      case 7: {
        let values = message.field_sfixed32 || (message.field_sfixed32 = {});
        let outerLimit = pushTemporaryLength(bb);
        let key;
        let value;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1:
              key = readInt32(bb);
              break;
            case 2:
              value = !!readByte(bb);
              break;
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
}

export function encodeMapTestLongAndBool(message) {
  let bb = newByteBuffer();

  // optional map<int64, bool> field_int64 = 1;
  let map$field_int64 = message.field_int64;
  if (map$field_int64 !== undefined) {
    for (let key in map$field_int64) {
      let nested = newByteBuffer();
      let value = map$field_int64[key];
      writeVarint32(nested, 8);
      writeVarint64(nested, stringToLong(key));
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 10);
      writeVarint32(bb, nested.offset);
      writeBytes(bb, toUint8Array(nested));
    }
  }

  // optional map<uint64, bool> field_uint64 = 2;
  let map$field_uint64 = message.field_uint64;
  if (map$field_uint64 !== undefined) {
    for (let key in map$field_uint64) {
      let nested = newByteBuffer();
      let value = map$field_uint64[key];
      writeVarint32(nested, 8);
      writeVarint64(nested, stringToLong(key));
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 18);
      writeVarint32(bb, nested.offset);
      writeBytes(bb, toUint8Array(nested));
    }
  }

  // optional map<sint64, bool> field_sint64 = 3;
  let map$field_sint64 = message.field_sint64;
  if (map$field_sint64 !== undefined) {
    for (let key in map$field_sint64) {
      let nested = newByteBuffer();
      let value = map$field_sint64[key];
      writeVarint32(nested, 8);
      writeVarint64ZigZag(nested, stringToLong(key));
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 26);
      writeVarint32(bb, nested.offset);
      writeBytes(bb, toUint8Array(nested));
    }
  }

  // optional map<fixed64, bool> field_fixed64 = 4;
  let map$field_fixed64 = message.field_fixed64;
  if (map$field_fixed64 !== undefined) {
    for (let key in map$field_fixed64) {
      let nested = newByteBuffer();
      let value = map$field_fixed64[key];
      writeVarint32(nested, 9);
      writeInt64(nested, stringToLong(key));
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 34);
      writeVarint32(bb, nested.offset);
      writeBytes(bb, toUint8Array(nested));
    }
  }

  // optional map<sfixed64, bool> field_sfixed64 = 5;
  let map$field_sfixed64 = message.field_sfixed64;
  if (map$field_sfixed64 !== undefined) {
    for (let key in map$field_sfixed64) {
      let nested = newByteBuffer();
      let value = map$field_sfixed64[key];
      writeVarint32(nested, 9);
      writeInt64(nested, stringToLong(key));
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 42);
      writeVarint32(bb, nested.offset);
      writeBytes(bb, toUint8Array(nested));
    }
  }

  // optional map<bool, bool> field_bool = 6;
  let map$field_bool = message.field_bool;
  if (map$field_bool !== undefined) {
    for (let key in map$field_bool) {
      let nested = newByteBuffer();
      let value = map$field_bool[key];
      writeVarint32(nested, 8);
      writeByte(nested, key === "true" ? 1 : 0);
      writeVarint32(nested, 16);
      writeByte(nested, value ? 1 : 0);
      writeVarint32(bb, 50);
      writeVarint32(bb, nested.offset);
      writeBytes(bb, toUint8Array(nested));
    }
  }

  return toUint8Array(bb);
}

export function decodeMapTestLongAndBool(binary) {
  let message = {};
  let bb = binary instanceof Uint8Array ? newByteBuffer(binary) : binary;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional map<int64, bool> field_int64 = 1;
      case 1: {
        let values = message.field_int64 || (message.field_int64 = {});
        let outerLimit = pushTemporaryLength(bb);
        let key;
        let value;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1:
              key = readVarint64(bb, /* unsigned */ false);
              break;
            case 2:
              value = !!readByte(bb);
              break;
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

      // optional map<uint64, bool> field_uint64 = 2;
      case 2: {
        let values = message.field_uint64 || (message.field_uint64 = {});
        let outerLimit = pushTemporaryLength(bb);
        let key;
        let value;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1:
              key = readVarint64(bb, /* unsigned */ true);
              break;
            case 2:
              value = !!readByte(bb);
              break;
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

      // optional map<sint64, bool> field_sint64 = 3;
      case 3: {
        let values = message.field_sint64 || (message.field_sint64 = {});
        let outerLimit = pushTemporaryLength(bb);
        let key;
        let value;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1:
              key = readVarint64ZigZag(bb);
              break;
            case 2:
              value = !!readByte(bb);
              break;
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

      // optional map<fixed64, bool> field_fixed64 = 4;
      case 4: {
        let values = message.field_fixed64 || (message.field_fixed64 = {});
        let outerLimit = pushTemporaryLength(bb);
        let key;
        let value;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1:
              key = readInt64(bb, /* unsigned */ true);
              break;
            case 2:
              value = !!readByte(bb);
              break;
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
        let values = message.field_sfixed64 || (message.field_sfixed64 = {});
        let outerLimit = pushTemporaryLength(bb);
        let key;
        let value;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1:
              key = readInt64(bb, /* unsigned */ false);
              break;
            case 2:
              value = !!readByte(bb);
              break;
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

      // optional map<bool, bool> field_bool = 6;
      case 6: {
        let values = message.field_bool || (message.field_bool = {});
        let outerLimit = pushTemporaryLength(bb);
        let key;
        let value;
        end_of_entry: while (!isAtEnd(bb)) {
          let tag = readVarint32(bb);
          switch (tag >>> 3) {
            case 0:
              break end_of_entry;
            case 1:
              key = !!readByte(bb);
              break;
            case 2:
              value = !!readByte(bb);
              break;
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
}

function pushTemporaryLength(bb) {
  let length = readVarint32(bb);
  let limit = bb.limit;
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
  let low = value.low;
  let high = value.high;
  return String.fromCharCode(
    low & 0xFFFF,
    low >>> 16,
    high & 0xFFFF,
    high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

let utf8Decoder = new TextDecoder();
let utf8Encoder = new TextEncoder();

let f32 = new Float32Array(1);
let f32_u8 = new Uint8Array(f32.buffer);

let f64 = new Float64Array(1);
let f64_u8 = new Uint8Array(f64.buffer);

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
  let bytes = bb.bytes;
  let limit = bb.limit;
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
  let bytes = bb.bytes;
  let offset = bb.offset;
  let limit = bb.limit;
  let finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2);
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
  let offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb, count) {
  let offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb, buffer) {
  let offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readByte(bb) {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb, value) {
  let offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb) {
  let offset = advance(bb, 4);
  f32_u8.set(bb.bytes.subarray(offset, offset + 4));
  return f32[0];
}

function writeFloat(bb, value) {
  let offset = grow(bb, 4);
  f32[0] = value;
  bb.bytes.set(f32_u8, offset);
}

function readDouble(bb) {
  let offset = advance(bb, 8);
  f64_u8.set(bb.bytes.subarray(offset, offset + 8));
  return f64[0];
}

function writeDouble(bb, value) {
  let offset = grow(bb, 8);
  f64[0] = value;
  bb.bytes.set(f64_u8, offset);
}

function readInt32(bb) {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb, value) {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
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
  let c = 0;
  let value = 0;
  let b;
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
  let part0 = 0;
  let part1 = 0;
  let part2 = 0;
  let b;

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
  let part0 = value.low >>> 0;
  let part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  let part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  let size =
    part2 === 0 ?
      part1 === 0 ?
        part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
          part0 < 1 << 21 ? 3 : 4 :
        part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
          part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

  let offset = grow(bb, size);
  let bytes = bb.bytes;

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
  let value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb, value) {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb) {
  let value = readVarint64(bb, /* unsigned */ false);
  let low = value.low;
  let high = value.high;
  let flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb, value) {
  let low = value.low;
  let high = value.high;
  let flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}
