// 操作 dom

const local  = document.querySelector('#local'),
      root = document.querySelector('.zi-dialog-root'),
      dev = document.querySelector('.zi-btn.medium')


require('../lib/osx.js')

const fs = require('fs')


local.addEventListener('click',e=>{
  root.classList.add('fade')
})

dev.addEventListener('click',e=>{
  root.classList.remove('fade')
})

let dialogWrap = document.querySelectorAll('.zi-dialog-backdrop.responsive') || []

dialogWrap.forEach(item=> {
  item.addEventListener('click',()=> {
    let parent = item.parentNode
    parent.classList.add('fade')
  })
})

document.getElementById('scanToMusic')
  .addEventListener('dblclick',()=> {
    require('electron').remote.dialog.showOpenDialog({
      title: '添加目录',
      properties: ['openDirectory', 'multiSelections', 'openFile']
    },files=> {
      const scan = require('../lib/scan.js'),
            db = require('../lib/homefile.js').dbJSON
      let arr = scan(files)
      console.log(arr)
      if (arr.length >= 1) {
        console.log('保存数据')
        db.set('songs',arr)
      } else {
        console.log('异步读取失败')
      }
      
    })
  })