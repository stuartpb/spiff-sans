function quoted(char) {
  // This is kind of overkill, but
  return JSON.stringify(char);
}

var names = require('./glyphmodnames.js');
var scadcode = require('./scadcode.js');

module.exports = function(font){

  var prefix = font.prefix
    || font.name && font.name.replace(/\W*/g,'').toLowerCase()
    || 'font';

  var glyphlist = [];

  for (var k in font.glyphs) {
    glyphlist[glyphlist.length] = k;
  }

  glyphlist.sort();

  var lines = [];
  var i, char;

  // Add header.
  if (font.name) {
    lines[lines.length] = '// ' + font.name;
  }
  if (font.author) {
    lines[lines.length] = '// Author: ' + font.author;
  }

  if (lines.length > 0) lines[lines.length] = '';

  lines[lines.length] = prefix +' = [';

  for(i=0; i < glyphlist.length; i++) {
    char = glyphlist[i];

    var row = [char, font.glyphs[char].width];

    if(font.glyphs[char].paths)
      row[row.length] = scadcode.polyvector(font.glyphs[char].paths);

    lines[lines.length] = '  ' + JSON.stringify(row) + (i == glyphlist.length-1? '' : ',');
  }

  lines[lines.length] = ']';

  return lines.join('\n')+'\n';
};