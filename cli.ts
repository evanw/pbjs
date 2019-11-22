#!/usr/bin/env node

import * as commander from 'commander';
import * as fs from 'fs';
import { parseSchema } from './index';

commander
  .version(JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8')).version)
  .arguments('<schema_path>')
  .option('--js <js_path>', 'Generate JavaScript code')
  .option('--ts <js_path>', 'Generate TypeScript code')
  .option('--es6', 'Generate ES6 JavaScript code')
  .option('--decode <msg_type>', 'Decode standard input to JSON')
  .option('--encode <msg_type>', 'Encode standard input to JSON')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit(1);
}

const contents = fs.readFileSync(commander.args[0], 'utf8');
const schema = parseSchema(contents);
const es6 = !!commander.es6;

// Generate JavaScript code
if (commander.js) {
  const js = schema.toJavaScript({ es6 });
  fs.writeFileSync(commander.js, js);
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

if (!commander.js && !commander.ts && !commander.decode && !commander.encode) {
  commander.outputHelp();
  process.exit(1);
}
