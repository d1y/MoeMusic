// 公用方法
const fs = require('fs')
const log = e=> console.log(e)
const path = require('path')

// 文件是否存在
function fsExistsSync(path) {
  try{
      fs.accessSync(path,fs.F_OK);
  }catch(e){
      return false;
  }
  return true;
}

// 判断为文件或目录
let exists =  path => fs.existsSync(path) || path.existsSync(path),
    isFile = path => exists(path) && fs.statSync(path).isFile(),
    isDir = path => exists(path) && fs.statSync(path).isDirectory()

module.exports = {
  fsExistsSync,
  log,
  isFile,
  isDir
}