declare module 'protocol-buffers-schema' {
  export interface Schema {
    package: string | null;
    syntax: number;
    enums: {
      name: string;
      values: {
        value: string;
      }[];
    }[];
    messages: {
      name: string;
      fields: {
        name: string;
        tag: number;
        type: string;
        required: boolean;
        repeated: boolean;
        map: { from: string, to: string } | null;
        oneof: string | null;
        options: { [key: string]: string };
      }[];
    }[];
  }

  export function parse(text: string): Schema;
}
