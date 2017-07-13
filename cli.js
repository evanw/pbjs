#!/usr/bin/env node

var commander = require('commander');
var index = require('./index');
var fs = require('fs');

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

var contents = fs.readFileSync(commander.args[0], 'utf8');
var schema = index.parseSchema(contents);

// Generate JavaScript code
if (commander.js) {
  var js = schema.toJavaScript();
  fs.writeFileSync(commander.js, js);
}

// Decode standard input to JSON
else if (commander.decode) {
  var chunks = [];
  process.stdin.on('data', function(chunk) {
    chunks.push(chunk);
  });
  process.stdin.on('end', function() {
    console.log(JSON.stringify(schema.compile()['decode' + commander.decode](Buffer.concat(chunks)), null, 2));
  });
  process.stdin.resume();
}

// Encode standard input to JSON
else if (commander.encode) {
  var chunks = [];
  process.stdin.on('data', function(chunk) {
    chunks.push(chunk);
  });
  process.stdin.on('end', function() {
    process.stdout.write(schema.compile()['encode' + commander.encode](JSON.parse(chunks.join(''))));
  });
  process.stdin.resume();
}

else {
  commander.outputHelp();
  process.exit(1);
}
