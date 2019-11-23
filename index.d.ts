export interface ParsedSchema {
  compile(): any;
  toJavaScript(options?: JsOptions): string;
  toTypeScript(): string;
}

export interface JsOptions {
  es6?: boolean;
}

export function parseSchema(contents: string): ParsedSchema;
