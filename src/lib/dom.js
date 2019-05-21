// 操作 dom

const local = document.querySelector('#local'),
  root = document.querySelector('.zi-dialog-root'),
  dev = document.querySelector('.zi-btn.medium'),
  create = require('../lib/createElement'),
  {
    db,
    set,
    get,
    isSongs,
    loadSongs,
    playTasks
  } = require('../lib/local'),
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
      console.log(`扫描的目录`,files)
      const scan = require('../lib/scan.js')
      scan(files)
      loadSongs(db)
      isSongs()
    })
  })

function checkMusic(e) {
  // 存储在本地是为了提高性能???
  set('local_songs_index', this.getAttribute('data-index') - 1)
  set('local_songs_url', this.getAttribute('data-url'))
  set('local_songs_name', this.getAttribute('data-name'))
  MUSIC.Src(this.getAttribute('data-url'))
  MUSIC.play()
  playTasks({
    title: this.getAttribute('data-name'),
  })
}

loadSongs(db)

{
  let index = get('local_songs_index'),
      name = get('local_songs_name'),
      url = get('local_songs_url')
  MUSIC.Src(url)
  playTasks({
    title: name
  })
}

window.go = () => window.location.reload()