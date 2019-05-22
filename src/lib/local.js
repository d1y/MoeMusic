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
    jq('#zi-music-ctrl')
      .classList.remove('zi-none')
  } else {
    jq('#zi-music-ctrl')
      .classList.add('zi-none')
  }
}
isSongs()
// music ctrl
jq('#local-music-played')
  .addEventListener('click', function() {
    let t = [
      'pause',
      'play'
    ]
    if (!MUSIC.currentSrc()) MUSIC.Src(db[parseInt(get('local_songs_index'))].src)
    if (MUSIC.paused()) {
      MUSIC.play()
      this.innerHTML = t[0]
    } else {
      MUSIC.pause()
      this.innerHTML = t[1]
    }
  })

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
  .addEventListener('click',function(){
    let wrap = jq('#local-wrap'),n = `icono-caretUp btn`,
    y = `icono-caretDown btn`,z = `zi-none`
    this.className = this.className == y ? n : y
    wrap.classList.toggle(z)
  })

jq('span[title=上一曲]')
  .addEventListener('click',ctrlPlay)

jq('span[title=下一曲]')
  .addEventListener('click',ctrlPlay)

jq('#local-music-mode')
  .addEventListener('click',function(){
    let mode = this.innerHTML
    let q = ['random','order']
    let dev = mode == q[0] ? q[1] : q[0]
    this.innerHTML = dev
    set('local_songs_mode',dev)
  })

jq('#local')
  .addEventListener('click',()=> {
    jq('#local-wrap').classList.remove('zi-none')
  })

function ctrlPlay (e,bl) {
  let currentTitle = this.title
  let currentPage = parseInt(get('local_songs_index'))
  let max = db.length-1 || 0
  if (currentTitle == `上一曲`) {
    currentPage = currentPage <= 0 ? max : --currentPage
  } else if (currentTitle == `下一曲` || bl) {
    currentPage = currentPage >= max ? 0 : ++currentPage
  }
  let currentSong = db[currentPage]
  if (typeof e == 'boolean') { // 随机
    let random = e=> Math.floor(Math.random() * e.length)
    let range = random(db)
    console.log(range)
    currentSong = db[range]
    currentPage = range
  }
  playTasks({
    title: currentSong.name
  })
  set('local_songs_index',currentPage),
  set('local_songs_url',currentSong.src)
  set('local_songs_name',currentSong.name)
  MUSIC.Src(currentSong.src)
  MUSIC.play()
}

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
    if (MUSIC.ended()) {
      let mode = get('local_songs_mode') || `order`
      if (mode.indexOf('"') >= 0 && mode.lastIndexOf('"')) {
        mode = mode.substr(1,mode.length - 2)
      }
      clearInterval(loopCtrl)
      if (mode == `order`) {
        ctrlPlay(this,true)
      } else if (mode == `random`) {
        ctrlPlay(true)
      }
    }
  }, 1000)
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