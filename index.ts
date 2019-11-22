import * as parser from 'protocol-buffers-schema';
import * as ByteBuffer from 'bytebuffer';
import * as js from './js';

export interface ParsedSchema {
  compile(): any;
  toJavaScript(options?: Options): string;
}

export interface Options {
  es6?: boolean;
}

export function parseSchema(contents: string): ParsedSchema {
  const schema = parser.parse(contents);

  return {
    compile(): any {
      const result = {};
      new Function('exports', 'ByteBuffer', js.generate(schema))(result, ByteBuffer);
      return result;
    },

    toJavaScript({ es6 }: Options = {}): string {
      return js.generate(schema, { es6 });
    },
  };
};
