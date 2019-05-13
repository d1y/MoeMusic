// 定义项目主目录 + 配置文件
const utils = require('../lib/utils'),
      fs = require('fs')

const os = require('os')

let home = os.homedir()

let diy = `.mm`

let isFile = utils.fsExistsSync(`${home}/${diy}`)

if (!isFile) {
  fs.mkdirSync(`${home}/${diy}`)
  console.log(`成功创建数据文件夹 ${home}/${diy}`)
}

module.exports = {
  home
}