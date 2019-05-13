// 扫描音乐

const fs = require('fs'),
  utils = require('../lib/utils.js'),
  path = require('path')

// 自动忽略 .文件
let dotFiles = arr => {
  arr = arr || []
  let result = []
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    let isDot = item.startsWith('.')
    if (!isDot) result.push(item)
  }
  return result
}

let data = require('../lib/local'),
    db = data.db
    

function hasItem(arr,id) {
  id = JSON.stringify(id)
  arr.forEach((item,index)=> {
    if (JSON.stringify(item) == id) db.splice(index,1)
  })
  return false
}
function scan(t) {

  if (!Array.isArray(t)) return
  for (let index = 0; index < t.length; index++) {
    const element = t[index];
    if (utils.isFile(element)) {
      let e = ex(element)
      if (e) {
        // 文件
        let d = ex(element,true)
        hasItem(db,d)
        db.unshift(d)
        data.set(db)
      }
    } else {
        // 文件夹
        let path = element
        // console.log(path)
        let files = fs.readdirSync(path),
            tmp = files.map(item=> `${path}/${item}`)
        scan(tmp)
    }
  }
}

function ex(s,bl) {
  // 判断后缀名
  let y = [
    '.mp3',
    '.mp4',
    '.m4a',
    '.wav'
  ]
  if (!bl) {
    for (let i = 0; i < y.length; i++) {
      if (s.endsWith(y[i])) {
        return true
      }
    }
    return false
  } else {
    let o = s,e = path.parse(s)
    return {
      src: s,
      name: e.name
    }
  }
}

module.exports = scan