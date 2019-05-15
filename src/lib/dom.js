// 操作 dom

const local = document.querySelector('#local'),
  root = document.querySelector('.zi-dialog-root'),
  dev = document.querySelector('.zi-btn.medium'),
  create = require('../lib/createElement'),
  {db,set,get} = require('../lib/local'),
  MUSIC = require('../lib/localMusic')

require('../lib/osx.js')

local.addEventListener('click', e => {
  root.classList.add('fade')
})

dev.addEventListener('click', e => {
  root.classList.remove('fade')
})

let dialogWrap = document.querySelectorAll('.zi-dialog-backdrop.responsive') || []

dialogWrap.forEach(item => {
  item.addEventListener('click', () => {
    let parent = item.parentNode
    parent.classList.add('fade')
  })
})

document.getElementById('scanToMusic')
  .addEventListener('dblclick', () => {
    require('electron').remote.dialog.showOpenDialog({
      title: '添加目录',
      properties: ['openDirectory', 'multiSelections', 'openFile']
    }, files => {
      const scan = require('../lib/scan.js')
      scan(files)
      loadSongs(db)
    })
  })

function loadSongs(db) {
  const ul =  document.querySelector('#local-list')
  ul.innerHTML = ``
  db.forEach((item,index)=> {
    const li = create.li({},item.name)
    li.setAttribute('data-name',item.name)
    li.setAttribute('data-url',item.src)
    li.setAttribute('data-index',index+1)
    li.addEventListener('click',checkMusic)
    ul.appendChild(li)
  })
}

function checkMusic (e) {
  set('local_songs_index',this.getAttribute('data-index')-1)
  set('local_songs_url',this.getAttribute('data-url'))
  set('local_songs_name',this.getAttribute('data-name'))
  MUSIC.src(this.getAttribute('data-url'))
  MUSIC.play()
}

loadSongs(db)

window.go = ()=> window.location.reload()