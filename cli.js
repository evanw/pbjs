#!/usr/bin/env node

const commander = require('commander');
const index = require('./index');
const fs = require('fs');

commander
  .version(JSON.parse(fs.readFileSync(__dirname + '/package.json')).version)
  .arguments('<schema_path>')
  .option('--js <js_path>', 'Generate JavaScript code')
  .option('--decode <msg_type>', 'Decode standard input to JSON')
  .option('--encode <msg_type>', 'Encode standard input to JSON')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
  process.exit(1);
}

const contents = fs.readFileSync(commander.args[0], 'utf8');
const schema = index.parseSchema(contents);

// Generate JavaScript code
if (commander.js) {
  const js = schema.toJavaScript();
  fs.writeFileSync(commander.js, js);
}

// Decode standard input to JSON
else if (commander.decode) {
  const chunks = [];
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
  const chunks = [];
  process.stdin.on('data', chunk => {
    chunks.push(chunk);
  });
  process.stdin.on('end', () => {
    process.stdout.write(schema.compile()['encode' + commander.encode](JSON.parse(chunks.join(''))));
  });
  process.stdin.resume();
}

else {
  commander.outputHelp();
  process.exit(1);
}
