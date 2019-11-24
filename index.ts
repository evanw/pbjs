import * as parser from 'protocol-buffers-schema';
import { generate } from './generate';
import { ParsedSchema, JsOptions } from './index.d';

export function parseSchema(contents: string): ParsedSchema {
  const schema = parser.parse(contents);

  return {
    compile(): any {
      const result = {};
      new Function('exports', generate(schema))(result);
      return result;
    },

    toJavaScript({ es6 }: JsOptions = {}): string {
      return generate(schema, { es6 });
    },

    toTypeScript(): string {
      return generate(schema, { typescript: true });
    },
  };
};
