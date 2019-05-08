// 定义项目主目录 + 配置文件
const db = require('lowdb'),
      utils = require('../lib/utils'),
      fs = require('fs')

const FileSync = require('lowdb/adapters/FileSync')

const os = require('os')

let home = os.homedir()

let diy = `.mm`

let isFile = utils.fsExistsSync(`${home}/${diy}`)

if (!isFile) {
  fs.mkdirSync(`${home}/${diy}`)
  console.log(`成功创建文件夹 ${home}/${diy}`)
}

let dbName = `db.json`

const adapter = new FileSync(`${home}/${diy}/${dbName}`)

const dbJSON = db(adapter)

module.exports = {
  home,
  dbJSON
}