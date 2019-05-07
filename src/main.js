const fs = require('fs'),
      pug = require('pug')

const compiledFunction = pug.compileFile('file:///Users/kozo4/cat/Project/MoeMusic/src/pug/index.pug');

console.log(compiledFunction)