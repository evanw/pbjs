import * as ByteBuffer from "bytebuffer";
import * as Long from "long";

function $pushTemporaryLength(buffer: ByteBuffer): number {
  const length = buffer.readVarint32();
  const limit = buffer.limit;
  buffer.limit = buffer.offset + length;
  return limit;
}

function $skipUnknownField(buffer: ByteBuffer, type: number): void {
  switch (type) {
    case 0: while (buffer.readByte() & 0x80) {} break;
    case 2: buffer.skip(buffer.readVarint32()); break;
    case 5: buffer.skip(4); break;
    case 1: buffer.skip(8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

function $coerceLong(value: any): Long {
  if (!(value instanceof Long) && "low" in value && "high" in value)
    value = new Long(value.low, value.high, value.unsigned);
  return value;
}

export enum Enum {
  A = "A",
  B = "B",
}

export const encodeEnum: {[key: string]: number} = {
  A: 0,
  B: 1,
};

export const decodeEnum: {[key: number]: Enum} = {
  0: Enum.A,
  1: Enum.B,
};

export interface Nested {
  x?: number;
  y?: number;
}

export function encodeNested(message: Nested): Uint8Array {
  const buffer = new ByteBuffer(undefined, /* isLittleEndian */ true);

  // optional float x = 1;
  const $x = message.x;
  if ($x !== undefined) {
    buffer.writeVarint32(13);
    buffer.writeFloat($x);
  }

  // optional float y = 2;
  const $y = message.y;
  if ($y !== undefined) {
    buffer.writeVarint32(21);
    buffer.writeFloat($y);
  }

  return buffer.flip().toBuffer();
}

export function decodeNested(binary: ByteBuffer | Uint8Array | ArrayBuffer): Nested {
  const message: Nested = {} as any;
  const buffer = binary instanceof ByteBuffer ? binary : ByteBuffer.wrap(binary, /* isLittleEndian */ true);

  end_of_message: while (buffer.remaining() > 0) {
    const tag = buffer.readVarint32();

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
      $skipUnknownField(buffer, tag & 7);
    }
  }

  return message;
}

export interface Optional {
  field_int32?: number;
  field_int64?: Long;
  field_uint32?: number;
  field_uint64?: Long;
  field_sint32?: number;
  field_sint64?: Long;
  field_bool?: boolean;
  field_fixed64?: Long;
  field_sfixed64?: Long;
  field_double?: number;
  field_string?: string;
  field_bytes?: Uint8Array;
  field_fixed32?: number;
  field_sfixed32?: number;
  field_float?: number;
  field_nested?: Nested;
}

export function encodeOptional(message: Optional): Uint8Array {
  const buffer = new ByteBuffer(undefined, /* isLittleEndian */ true);

  // optional int32 field_int32 = 1;
  const $field_int32 = message.field_int32;
  if ($field_int32 !== undefined) {
    buffer.writeVarint32(8);
    buffer.writeVarint64($field_int32 | 0);
  }

  // optional int64 field_int64 = 2;
  const $field_int64 = message.field_int64;
  if ($field_int64 !== undefined) {
    buffer.writeVarint32(16);
    buffer.writeVarint64($coerceLong($field_int64));
  }

  // optional uint32 field_uint32 = 3;
  const $field_uint32 = message.field_uint32;
  if ($field_uint32 !== undefined) {
    buffer.writeVarint32(24);
    buffer.writeVarint32($field_uint32);
  }

  // optional uint64 field_uint64 = 4;
  const $field_uint64 = message.field_uint64;
  if ($field_uint64 !== undefined) {
    buffer.writeVarint32(32);
    buffer.writeVarint64($coerceLong($field_uint64));
  }

  // optional sint32 field_sint32 = 5;
  const $field_sint32 = message.field_sint32;
  if ($field_sint32 !== undefined) {
    buffer.writeVarint32(40);
    buffer.writeVarint32ZigZag($field_sint32);
  }

  // optional sint64 field_sint64 = 6;
  const $field_sint64 = message.field_sint64;
  if ($field_sint64 !== undefined) {
    buffer.writeVarint32(48);
    buffer.writeVarint64ZigZag($coerceLong($field_sint64));
  }

  // optional bool field_bool = 7;
  const $field_bool = message.field_bool;
  if ($field_bool !== undefined) {
    buffer.writeVarint32(56);
    buffer.writeByte($field_bool ? 1 : 0);
  }

  // optional fixed64 field_fixed64 = 8;
  const $field_fixed64 = message.field_fixed64;
  if ($field_fixed64 !== undefined) {
    buffer.writeVarint32(65);
    buffer.writeUint64($coerceLong($field_fixed64));
  }

  // optional sfixed64 field_sfixed64 = 9;
  const $field_sfixed64 = message.field_sfixed64;
  if ($field_sfixed64 !== undefined) {
    buffer.writeVarint32(73);
    buffer.writeInt64($coerceLong($field_sfixed64));
  }

  // optional double field_double = 10;
  const $field_double = message.field_double;
  if ($field_double !== undefined) {
    buffer.writeVarint32(81);
    buffer.writeDouble($field_double);
  }

  // optional string field_string = 11;
  const $field_string = message.field_string;
  if ($field_string !== undefined) {
    buffer.writeVarint32(90);
    const nested = new ByteBuffer(undefined, /* isLittleEndian */ true);
    nested.writeUTF8String($field_string), buffer.writeVarint32(nested.flip().limit), buffer.append(nested);
  }

  // optional bytes field_bytes = 12;
  const $field_bytes = message.field_bytes;
  if ($field_bytes !== undefined) {
    buffer.writeVarint32(98);
    buffer.writeVarint32($field_bytes.length), buffer.append($field_bytes);
  }

  // optional fixed32 field_fixed32 = 13;
  const $field_fixed32 = message.field_fixed32;
  if ($field_fixed32 !== undefined) {
    buffer.writeVarint32(109);
    buffer.writeUint32($field_fixed32);
  }

  // optional sfixed32 field_sfixed32 = 14;
  const $field_sfixed32 = message.field_sfixed32;
  if ($field_sfixed32 !== undefined) {
    buffer.writeVarint32(117);
    buffer.writeInt32($field_sfixed32);
  }

  // optional float field_float = 15;
  const $field_float = message.field_float;
  if ($field_float !== undefined) {
    buffer.writeVarint32(125);
    buffer.writeFloat($field_float);
  }

  // optional Nested field_nested = 16;
  const $field_nested = message.field_nested;
  if ($field_nested !== undefined) {
    buffer.writeVarint32(130);
    const nested = encodeNested($field_nested);
    buffer.writeVarint32(nested.byteLength), buffer.append(nested);
  }

  return buffer.flip().toBuffer();
}

export function decodeOptional(binary: ByteBuffer | Uint8Array | ArrayBuffer): Optional {
  const message: Optional = {} as any;
  const buffer = binary instanceof ByteBuffer ? binary : ByteBuffer.wrap(binary, /* isLittleEndian */ true);

  end_of_message: while (buffer.remaining() > 0) {
    const tag = buffer.readVarint32();

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
      message.field_string = buffer.readUTF8String(buffer.readVarint32(), ByteBuffer.METRICS_BYTES) as string;
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
      const limit = $pushTemporaryLength(buffer);
      message.field_nested = decodeNested(buffer);
      buffer.limit = limit;
      break;
    }

    default:
      $skipUnknownField(buffer, tag & 7);
    }
  }

  return message;
}

export interface RepeatedUnpacked {
  field_int32?: number[];
  field_int64?: Long[];
  field_uint32?: number[];
  field_uint64?: Long[];
  field_sint32?: number[];
  field_sint64?: Long[];
  field_bool?: boolean[];
  field_fixed64?: Long[];
  field_sfixed64?: Long[];
  field_double?: number[];
  field_string?: string[];
  field_bytes?: Uint8Array[];
  field_fixed32?: number[];
  field_sfixed32?: number[];
  field_float?: number[];
  field_nested?: Nested[];
}

export function encodeRepeatedUnpacked(message: RepeatedUnpacked): Uint8Array {
  const buffer = new ByteBuffer(undefined, /* isLittleEndian */ true);

  // repeated int32 field_int32 = 1;
  const array$field_int32 = message.field_int32;
  if (array$field_int32 !== undefined) {
    for (const $field_int32 of array$field_int32) {
      buffer.writeVarint32(8);
      buffer.writeVarint64($field_int32 | 0);
    }
  }

  // repeated int64 field_int64 = 2;
  const array$field_int64 = message.field_int64;
  if (array$field_int64 !== undefined) {
    for (const $field_int64 of array$field_int64) {
      buffer.writeVarint32(16);
      buffer.writeVarint64($coerceLong($field_int64));
    }
  }

  // repeated uint32 field_uint32 = 3;
  const array$field_uint32 = message.field_uint32;
  if (array$field_uint32 !== undefined) {
    for (const $field_uint32 of array$field_uint32) {
      buffer.writeVarint32(24);
      buffer.writeVarint32($field_uint32);
    }
  }

  // repeated uint64 field_uint64 = 4;
  const array$field_uint64 = message.field_uint64;
  if (array$field_uint64 !== undefined) {
    for (const $field_uint64 of array$field_uint64) {
      buffer.writeVarint32(32);
      buffer.writeVarint64($coerceLong($field_uint64));
    }
  }

  // repeated sint32 field_sint32 = 5;
  const array$field_sint32 = message.field_sint32;
  if (array$field_sint32 !== undefined) {
    for (const $field_sint32 of array$field_sint32) {
      buffer.writeVarint32(40);
      buffer.writeVarint32ZigZag($field_sint32);
    }
  }

  // repeated sint64 field_sint64 = 6;
  const array$field_sint64 = message.field_sint64;
  if (array$field_sint64 !== undefined) {
    for (const $field_sint64 of array$field_sint64) {
      buffer.writeVarint32(48);
      buffer.writeVarint64ZigZag($coerceLong($field_sint64));
    }
  }

  // repeated bool field_bool = 7;
  const array$field_bool = message.field_bool;
  if (array$field_bool !== undefined) {
    for (const $field_bool of array$field_bool) {
      buffer.writeVarint32(56);
      buffer.writeByte($field_bool ? 1 : 0);
    }
  }

  // repeated fixed64 field_fixed64 = 8;
  const array$field_fixed64 = message.field_fixed64;
  if (array$field_fixed64 !== undefined) {
    for (const $field_fixed64 of array$field_fixed64) {
      buffer.writeVarint32(65);
      buffer.writeUint64($coerceLong($field_fixed64));
    }
  }

  // repeated sfixed64 field_sfixed64 = 9;
  const array$field_sfixed64 = message.field_sfixed64;
  if (array$field_sfixed64 !== undefined) {
    for (const $field_sfixed64 of array$field_sfixed64) {
      buffer.writeVarint32(73);
      buffer.writeInt64($coerceLong($field_sfixed64));
    }
  }

  // repeated double field_double = 10;
  const array$field_double = message.field_double;
  if (array$field_double !== undefined) {
    for (const $field_double of array$field_double) {
      buffer.writeVarint32(81);
      buffer.writeDouble($field_double);
    }
  }

  // repeated string field_string = 11;
  const array$field_string = message.field_string;
  if (array$field_string !== undefined) {
    for (const $field_string of array$field_string) {
      const nested = new ByteBuffer(undefined, /* isLittleEndian */ true);
      buffer.writeVarint32(90);
      nested.writeUTF8String($field_string), buffer.writeVarint32(nested.flip().limit), buffer.append(nested);
    }
  }

  // repeated bytes field_bytes = 12;
  const array$field_bytes = message.field_bytes;
  if (array$field_bytes !== undefined) {
    for (const $field_bytes of array$field_bytes) {
      buffer.writeVarint32(98);
      buffer.writeVarint32($field_bytes.length), buffer.append($field_bytes);
    }
  }

  // repeated fixed32 field_fixed32 = 13;
  const array$field_fixed32 = message.field_fixed32;
  if (array$field_fixed32 !== undefined) {
    for (const $field_fixed32 of array$field_fixed32) {
      buffer.writeVarint32(109);
      buffer.writeUint32($field_fixed32);
    }
  }

  // repeated sfixed32 field_sfixed32 = 14;
  const array$field_sfixed32 = message.field_sfixed32;
  if (array$field_sfixed32 !== undefined) {
    for (const $field_sfixed32 of array$field_sfixed32) {
      buffer.writeVarint32(117);
      buffer.writeInt32($field_sfixed32);
    }
  }

  // repeated float field_float = 15;
  const array$field_float = message.field_float;
  if (array$field_float !== undefined) {
    for (const $field_float of array$field_float) {
      buffer.writeVarint32(125);
      buffer.writeFloat($field_float);
    }
  }

  // repeated Nested field_nested = 16;
  const array$field_nested = message.field_nested;
  if (array$field_nested !== undefined) {
    for (const $field_nested of array$field_nested) {
      const nested = encodeNested($field_nested);
      buffer.writeVarint32(130);
      buffer.writeVarint32(nested.byteLength), buffer.append(nested);
    }
  }

  return buffer.flip().toBuffer();
}

export function decodeRepeatedUnpacked(binary: ByteBuffer | Uint8Array | ArrayBuffer): RepeatedUnpacked {
  const message: RepeatedUnpacked = {} as any;
  const buffer = binary instanceof ByteBuffer ? binary : ByteBuffer.wrap(binary, /* isLittleEndian */ true);

  end_of_message: while (buffer.remaining() > 0) {
    const tag = buffer.readVarint32();

    switch (tag >>> 3) {
    case 0:
      break end_of_message;

    // repeated int32 field_int32 = 1;
    case 1: {
      const values = message.field_int32 || (message.field_int32 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_int64 || (message.field_int64 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_uint32 || (message.field_uint32 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_uint64 || (message.field_uint64 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_sint32 || (message.field_sint32 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_sint64 || (message.field_sint64 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_bool || (message.field_bool = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_fixed64 || (message.field_fixed64 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_sfixed64 || (message.field_sfixed64 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_double || (message.field_double = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_string || (message.field_string = []);
      values.push(buffer.readUTF8String(buffer.readVarint32(), ByteBuffer.METRICS_BYTES) as string);
      break;
    }

    // repeated bytes field_bytes = 12;
    case 12: {
      const values = message.field_bytes || (message.field_bytes = []);
      values.push(buffer.readBytes(buffer.readVarint32()).toBuffer());
      break;
    }

    // repeated fixed32 field_fixed32 = 13;
    case 13: {
      const values = message.field_fixed32 || (message.field_fixed32 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_sfixed32 || (message.field_sfixed32 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_float || (message.field_float = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const limit = $pushTemporaryLength(buffer);
      const values = message.field_nested || (message.field_nested = []);
      values.push(decodeNested(buffer));
      buffer.limit = limit;
      break;
    }

    default:
      $skipUnknownField(buffer, tag & 7);
    }
  }

  return message;
}

export interface RepeatedPacked {
  field_int32?: number[];
  field_int64?: Long[];
  field_uint32?: number[];
  field_uint64?: Long[];
  field_sint32?: number[];
  field_sint64?: Long[];
  field_bool?: boolean[];
  field_fixed64?: Long[];
  field_sfixed64?: Long[];
  field_double?: number[];
  field_string?: string[];
  field_bytes?: Uint8Array[];
  field_fixed32?: number[];
  field_sfixed32?: number[];
  field_float?: number[];
  field_nested?: Nested[];
  field_nested2?: Nested[];
}

export function encodeRepeatedPacked(message: RepeatedPacked): Uint8Array {
  const buffer = new ByteBuffer(undefined, /* isLittleEndian */ true);

  // repeated int32 field_int32 = 1;
  const array$field_int32 = message.field_int32;
  if (array$field_int32 !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_int32 of array$field_int32) {
      packed.writeVarint64($field_int32 | 0);
    }
    buffer.writeVarint32(10);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated int64 field_int64 = 2;
  const array$field_int64 = message.field_int64;
  if (array$field_int64 !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_int64 of array$field_int64) {
      packed.writeVarint64($coerceLong($field_int64));
    }
    buffer.writeVarint32(18);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated uint32 field_uint32 = 3;
  const array$field_uint32 = message.field_uint32;
  if (array$field_uint32 !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_uint32 of array$field_uint32) {
      packed.writeVarint32($field_uint32);
    }
    buffer.writeVarint32(26);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated uint64 field_uint64 = 4;
  const array$field_uint64 = message.field_uint64;
  if (array$field_uint64 !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_uint64 of array$field_uint64) {
      packed.writeVarint64($coerceLong($field_uint64));
    }
    buffer.writeVarint32(34);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated sint32 field_sint32 = 5;
  const array$field_sint32 = message.field_sint32;
  if (array$field_sint32 !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_sint32 of array$field_sint32) {
      packed.writeVarint32ZigZag($field_sint32);
    }
    buffer.writeVarint32(42);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated sint64 field_sint64 = 6;
  const array$field_sint64 = message.field_sint64;
  if (array$field_sint64 !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_sint64 of array$field_sint64) {
      packed.writeVarint64ZigZag($coerceLong($field_sint64));
    }
    buffer.writeVarint32(50);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated bool field_bool = 7;
  const array$field_bool = message.field_bool;
  if (array$field_bool !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_bool of array$field_bool) {
      packed.writeByte($field_bool ? 1 : 0);
    }
    buffer.writeVarint32(58);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated fixed64 field_fixed64 = 8;
  const array$field_fixed64 = message.field_fixed64;
  if (array$field_fixed64 !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_fixed64 of array$field_fixed64) {
      packed.writeUint64($coerceLong($field_fixed64));
    }
    buffer.writeVarint32(66);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated sfixed64 field_sfixed64 = 9;
  const array$field_sfixed64 = message.field_sfixed64;
  if (array$field_sfixed64 !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_sfixed64 of array$field_sfixed64) {
      packed.writeInt64($coerceLong($field_sfixed64));
    }
    buffer.writeVarint32(74);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated double field_double = 10;
  const array$field_double = message.field_double;
  if (array$field_double !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_double of array$field_double) {
      packed.writeDouble($field_double);
    }
    buffer.writeVarint32(82);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated string field_string = 11;
  const array$field_string = message.field_string;
  if (array$field_string !== undefined) {
    for (const $field_string of array$field_string) {
      const nested = new ByteBuffer(undefined, /* isLittleEndian */ true);
      buffer.writeVarint32(90);
      nested.writeUTF8String($field_string), buffer.writeVarint32(nested.flip().limit), buffer.append(nested);
    }
  }

  // repeated bytes field_bytes = 12;
  const array$field_bytes = message.field_bytes;
  if (array$field_bytes !== undefined) {
    for (const $field_bytes of array$field_bytes) {
      buffer.writeVarint32(98);
      buffer.writeVarint32($field_bytes.length), buffer.append($field_bytes);
    }
  }

  // repeated fixed32 field_fixed32 = 13;
  const array$field_fixed32 = message.field_fixed32;
  if (array$field_fixed32 !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_fixed32 of array$field_fixed32) {
      packed.writeUint32($field_fixed32);
    }
    buffer.writeVarint32(106);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated sfixed32 field_sfixed32 = 14;
  const array$field_sfixed32 = message.field_sfixed32;
  if (array$field_sfixed32 !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_sfixed32 of array$field_sfixed32) {
      packed.writeInt32($field_sfixed32);
    }
    buffer.writeVarint32(114);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated float field_float = 15;
  const array$field_float = message.field_float;
  if (array$field_float !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $field_float of array$field_float) {
      packed.writeFloat($field_float);
    }
    buffer.writeVarint32(122);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  // repeated Nested field_nested = 16;
  const array$field_nested = message.field_nested;
  if (array$field_nested !== undefined) {
    for (const $field_nested of array$field_nested) {
      const nested = encodeNested($field_nested);
      buffer.writeVarint32(130);
      buffer.writeVarint32(nested.byteLength), buffer.append(nested);
    }
  }

  // repeated Nested field_nested2 = 17;
  const array$field_nested2 = message.field_nested2;
  if (array$field_nested2 !== undefined) {
    for (const $field_nested2 of array$field_nested2) {
      const nested = encodeNested($field_nested2);
      buffer.writeVarint32(138);
      buffer.writeVarint32(nested.byteLength), buffer.append(nested);
    }
  }

  return buffer.flip().toBuffer();
}

export function decodeRepeatedPacked(binary: ByteBuffer | Uint8Array | ArrayBuffer): RepeatedPacked {
  const message: RepeatedPacked = {} as any;
  const buffer = binary instanceof ByteBuffer ? binary : ByteBuffer.wrap(binary, /* isLittleEndian */ true);

  end_of_message: while (buffer.remaining() > 0) {
    const tag = buffer.readVarint32();

    switch (tag >>> 3) {
    case 0:
      break end_of_message;

    // repeated int32 field_int32 = 1;
    case 1: {
      const values = message.field_int32 || (message.field_int32 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_int64 || (message.field_int64 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_uint32 || (message.field_uint32 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_uint64 || (message.field_uint64 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_sint32 || (message.field_sint32 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_sint64 || (message.field_sint64 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_bool || (message.field_bool = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_fixed64 || (message.field_fixed64 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_sfixed64 || (message.field_sfixed64 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_double || (message.field_double = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_string || (message.field_string = []);
      values.push(buffer.readUTF8String(buffer.readVarint32(), ByteBuffer.METRICS_BYTES) as string);
      break;
    }

    // repeated bytes field_bytes = 12;
    case 12: {
      const values = message.field_bytes || (message.field_bytes = []);
      values.push(buffer.readBytes(buffer.readVarint32()).toBuffer());
      break;
    }

    // repeated fixed32 field_fixed32 = 13;
    case 13: {
      const values = message.field_fixed32 || (message.field_fixed32 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_sfixed32 || (message.field_sfixed32 = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const values = message.field_float || (message.field_float = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
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
      const limit = $pushTemporaryLength(buffer);
      const values = message.field_nested || (message.field_nested = []);
      values.push(decodeNested(buffer));
      buffer.limit = limit;
      break;
    }

    // repeated Nested field_nested2 = 17;
    case 17: {
      const limit = $pushTemporaryLength(buffer);
      const values = message.field_nested2 || (message.field_nested2 = []);
      values.push(decodeNested(buffer));
      buffer.limit = limit;
      break;
    }

    default:
      $skipUnknownField(buffer, tag & 7);
    }
  }

  return message;
}

export interface EnumTest {
  a?: Enum;
  b: Enum;
  c?: Enum[];
}

export function encodeEnumTest(message: EnumTest): Uint8Array {
  const buffer = new ByteBuffer(undefined, /* isLittleEndian */ true);

  // optional Enum a = 1;
  const $a = message.a;
  if ($a !== undefined) {
    buffer.writeVarint32(8);
    buffer.writeVarint32(encodeEnum[$a]);
  }

  // required Enum b = 2;
  const $b = message.b;
  if ($b !== undefined) {
    buffer.writeVarint32(16);
    buffer.writeVarint32(encodeEnum[$b]);
  }

  // repeated Enum c = 3;
  const array$c = message.c;
  if (array$c !== undefined) {
    const packed = new ByteBuffer(undefined, /* isLittleEndian */ true);
    for (const $c of array$c) {
      packed.writeVarint32(encodeEnum[$c]);
    }
    buffer.writeVarint32(26);
    buffer.writeVarint32(packed.flip().limit);
    buffer.append(packed);
  }

  return buffer.flip().toBuffer();
}

export function decodeEnumTest(binary: ByteBuffer | Uint8Array | ArrayBuffer): EnumTest {
  const message: EnumTest = {} as any;
  const buffer = binary instanceof ByteBuffer ? binary : ByteBuffer.wrap(binary, /* isLittleEndian */ true);

  end_of_message: while (buffer.remaining() > 0) {
    const tag = buffer.readVarint32();

    switch (tag >>> 3) {
    case 0:
      break end_of_message;

    // optional Enum a = 1;
    case 1: {
      message.a = decodeEnum[buffer.readVarint32()];
      break;
    }

    // required Enum b = 2;
    case 2: {
      message.b = decodeEnum[buffer.readVarint32()];
      break;
    }

    // repeated Enum c = 3;
    case 3: {
      const values = message.c || (message.c = []);
      if ((tag & 7) === 2) {
        const outerLimit = $pushTemporaryLength(buffer);
        while (buffer.remaining() > 0) {
          values.push(decodeEnum[buffer.readVarint32()]);
        }
        buffer.limit = outerLimit;
      } else {
        values.push(decodeEnum[buffer.readVarint32()]);
      }
      break;
    }

    default:
      $skipUnknownField(buffer, tag & 7);
    }
  }

  if (message.b === undefined)
    throw new Error("Missing required field: b");

  return message;
}
