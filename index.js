const parser = require('protocol-buffers-schema');
const bytebuffer = require('bytebuffer');
const js = require('./js');

exports.parseSchema = contents => {
  const schema = parser.parse(contents);

  return {
    compile() {
      const result = {};
      new Function('exports', 'ByteBuffer', js.generate(schema))(result, bytebuffer);
      return result;
    },

    toJavaScript() {
      return js.generate(schema);
    },
  };
};
