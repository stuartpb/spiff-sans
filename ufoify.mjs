import YAML from 'yaml';
import {readFileSync, writeFileSync} from 'fs';
import aglfn from './aglfn.mjs';

function parseSequence(seq){
  var sequence = [];
  var nums = seq.split(/[\s,]+/g);
  for (var i = 0; i < nums.length; i+=2){
      sequence[sequence.length] = [parseFloat(nums[i])*100,parseFloat(nums[i+1])*100];
  }
  return sequence;
}
  
function parsePaths(paths) {
  if(Array.isArray(paths)) {
    if(typeof paths[0] == "string"){
      for (var i = 0; i < paths.length; i++) {
        paths[i] = parseSequence(paths[i]);
      }
      return paths;
    } else return paths;
  } else if (typeof paths == "string") {
    return [parseSequence(paths)];
  } else return paths;
}

export function parseGlyph(k, glyph){
  if (Array.isArray(glyph) || typeof glyph == "string")
    glyph = {paths: glyph};

  if (glyph.paths)
    glyph.paths = parsePaths(glyph.paths);

  glyph.char = k;
  glyph.name = aglfn.get(k) || k;
  glyph.filename = glyph.name.replace(/[A-Z]/g,'$&_') + '.glif';

  let width = 0;
  for (let i = 0; i < glyph.paths.length; i++){
    for (let j = 0; j < glyph.paths[i].length; j++){
      width = Math.max(width, glyph.paths[i][j][0]);
    }
  }
  glyph.width = width + 100;

  return glyph;
}

function unicodeHex(k) {
  return k.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0');
}

function glifBody(glyph){
  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<glyph name="${glyph.name}" format="2">`,
    `  <advance width="${glyph.width}"/>`,
    `  <unicode hex="${unicodeHex(glyph.char)}"/>`
  ];
  if (/[A-Z]/.test(glyph.char)) {
    lines.push(`  <unicode hex="${unicodeHex(glyph.char.toLowerCase())}"/>`);
  }
  lines.push(`  <outline>`);
  for (const path of glyph.paths) {
    lines.push(`    <contour>`);
    for (const p of path) {
      lines.push(`      <point x="${p[0]}" y="${p[1]}" type="line"/>`);
    }
    lines.push(`    </contour>`);
  }
  lines.push(`  </outline>`);
  lines.push(`</glyph>`);
  return lines.join('\n');
}

const glyphs = YAML.parse(readFileSync('spiffsans.yaml','utf-8')).glyphs;

const glyphlist = [];

for (const k in glyphs) {
  glyphlist[glyphlist.length] = k;
}

glyphlist.sort();

for (const k of glyphlist) {
  const glyph = parseGlyph(k, glyphs[k]);
  console.log(`    <key>${glyph.name}</key>
    <string>${glyph.filename}</string>`);
  writeFileSync('SpiffSans.ufo/glyphs/'+glyph.filename, glifBody(glyph));
}
