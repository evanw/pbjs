#!/usr/bin/env node

import * as commander from 'commander';
import * as fs from 'fs';
import { parseSchema } from './index';

commander
  .version(JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8')).version)
  .arguments('<schema_path>')
  .option('--es5 <js_path>', 'Generate ES5 JavaScript code')
  .option('--es6 <js_path>', 'Generate ES6 JavaScript code')
  .option('--ts <ts_path>', 'Generate TypeScript code')
  .option('--decode <msg_type>', 'Decode standard input to JSON')
  .option('--encode <msg_type>', 'Encode standard input to JSON')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit(1);
}

const contents = fs.readFileSync(commander.args[0], 'utf8');
const schema = parseSchema(contents);

// Generate ES5 JavaScript code
if (commander.es5) {
  const js = schema.toJavaScript({ es6: false });
  fs.writeFileSync(commander.es5, js);
}

// Generate ES6 JavaScript code
if (commander.es6) {
  const js = schema.toJavaScript({ es6: true });
  fs.writeFileSync(commander.es6, js);
}

// Generate TypeScript code
if (commander.ts) {
  const ts = schema.toTypeScript();
  fs.writeFileSync(commander.ts, ts);
}

// Decode standard input to JSON
if (commander.decode) {
  const chunks: Buffer[] = [];
  process.stdin.on('data', chunk => {
    chunks.push(chunk);
  });
  process.stdin.on('end', () => {
    console.log(JSON.stringify(schema.compile()['decode' + commander.decode](Buffer.concat(chunks)), null, 2));
  });
  process.stdin.resume();
}

// Encode standard input to JSON
else if (commander.encode) {
  const chunks: Buffer[] = [];
  process.stdin.on('data', chunk => {
    chunks.push(chunk);
  });
  process.stdin.on('end', () => {
    process.stdout.write(schema.compile()['encode' + commander.encode](JSON.parse(chunks.join(''))));
  });
  process.stdin.resume();
}

if (
  !commander.es5 &&
  !commander.es6 &&
  !commander.ts &&
  !commander.decode &&
  !commander.encode
) {
  commander.outputHelp();
  process.exit(1);
}
