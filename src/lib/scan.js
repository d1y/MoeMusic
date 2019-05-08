// 扫描音乐

const fs = require('fs'),
      utils = require('../lib/utils.js')
// 自动忽略 .文件
let dotFiles = arr=> {
  arr = arr || []
  let result = []
  for (let i =0; i< arr.length; i++) {
    let item = arr[i]
    let isDot = item.startsWith('.')
    if (!isDot) result.push(item)
  }
  return result
}

function scan(t) {
  let result = []
  for (let index = 0; index < t.length; index++) {
    const element = t[index];
    fs.readdir(element,(err,files)=> {
      let fuck = files // 路径
      if(err) throw err

      files = dotFiles(files)

      files.map(item=>result.push(`${element}/${item}`))
    })
  }
  return result
}


module.exports = scan