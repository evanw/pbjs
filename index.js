var parser = require('protocol-buffers-schema');
var bytebuffer = require('bytebuffer');
var js = require('./js');

exports.parseSchema = function(contents) {
  var schema = parser.parse(contents);

  return {
    compile: function() {
      var result = {};
      new Function('exports', 'ByteBuffer', js.generate(schema))(result, bytebuffer);
      return result;
    },

    toJavaScript: function() {
      return js.generate(schema);
    },
  };
};
