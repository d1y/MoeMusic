const local = window.localStorage

const jq = require('../lib/utils').jq,
  MUSIC = require('../lib/localMusic')

let json = local.getItem('songs')

let db = (!json || json == `undefined`) ? [] : JSON.parse(json)

let set = (key, any) => local.setItem(key, JSON.stringify(any))

let get = key => local.getItem(key)

function isSongs() {
  if (get('songs')) {
    jq('#zi-scan-tips')
      .classList.add('zi-none')
  } else {
    jq('#zi-music-ctrl')
      .classList.add('zi-none')
  }
}
isSongs()
// music ctrl
jq('#local-music-played')
  .addEventListener('click', () => MUSIC.paused() ? MUSIC.play() : MUSIC.pause())

jq('#local-music-volume')
  .addEventListener('click', function (e) {
    let ak = e.altKey,
      sk = e.shiftKey
    if (ak && sk) return
    if (sk) MUSIC.VPlus()
    if (ak) MUSIC.VReduce()
  })

jq('#local-music-loop')
  .addEventListener('click', () => MUSIC.loop())

let bar = jq('.progress-bar-check div')

jq('.progress-bar-wrap')
  .addEventListener('click', function (e) {
    let progress = e.offsetX / this.clientWidth * 100
    bar.style.width = progress + '%'
    MUSIC.setTime(MUSIC.duration() * progress / 100)
  })

jq('#searchToMusic') // 搜索功能就意思意思了呗~
  .addEventListener('input',function(e) {
    let value = this.value.toUpperCase()
    if (value == '' || value == ' ') {
      loadSongs(db)
      return
    }
    value = value.trim()
    value = value.split(` `)
    let checkTitle = value.filter(value=> value != ` `)
    // 很傻的方式,遍历之后全部转大写然后比对一下
    if (db.length <= 10) return // 要是只有10首就没有必要搜索了~
    let result = db.filter((key)=> {
      let title = key.name.toUpperCase()
      let flag = false
      checkTitle.forEach(item=> {
        if (title.includes(item)) {
          flag = true
          return 
        }
      })
      return flag
    })
    loadSongs(result)
  })

jq('#musicPlayer-close')
  .addEventListener('click',()=> {
    jq('#local-wrap')
      .classList.add('zi-none')
  })

function loadSongs(db) {
  const ul = document.querySelector('#local-list')
  ul.innerHTML = ``
  if (!Array.isArray(db)) return
  db.forEach((item, index) => {
    const li = create.li({}, item.name)
    li.setAttribute('data-name', item.name)
    li.setAttribute('data-url', item.src)
    li.setAttribute('data-index', index + 1)
    li.addEventListener('click', checkMusic)
    ul.appendChild(li)
  })
}

function playTasks(obj) {
  jq('#currentTitle')
    .innerHTML = obj.title
  const loopCtrl = setInterval(() => {
    jq('#currentTotal')
      .innerHTML = ctx(MUSIC.duration(),true)
    jq('#currentTime')
      .innerHTML = ctx(MUSIC.getTime())
    bar.style.width = (MUSIC.getTime() / MUSIC.duration() * 100) + '%'
  }, 1000)
  if (MUSIC.ended()) {
    // 默认情况下顺序播放!
    let rawIndex = get('local_songs_index')
        index = rawIndex >= get('songs').length ? 0 : ++rawIndex
    let info = get('songs')[index]
    set('local_songs_index',index)
    set('local_songs_url',info.src)
    set('local_songs_name',info.name)
    MUSIC.Src(info.src)
    playTasks({
      title: info.name
    })
    MUSIC.play()
  }
  function ctx(time,bl) {
    let s = Math.floor(time % 60)
    let t = Math.floor(time / 60)
    let f = e=> e<10 ? '0'+e : e
    return bl ? ` / ${f(t)}:${f(s)}` : `${f(t)}:${f(s)}`
  }
}

module.exports = {
  db,
  set,
  get,
  isSongs,
  loadSongs,
  playTasks
}