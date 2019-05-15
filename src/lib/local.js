const local = window.localStorage

const jq = require('../lib/utils').jq,
      MUSIC = require('../lib/localMusic')

let db = JSON.parse(local.getItem('songs')) || []

let set = (key,any) => {
  if (any) {
    local.setItem(key,JSON.stringify(any))
  }else {
    local.setItem('songs',JSON.stringify(any))
  }
}

let get = key => local.getItem(key)

if (get('songs')) {
  jq('#zi-scan-tips')
    .classList.add('zi-none')
} else {
  jq('#zi-music-ctrl')
    .classList.add('zi-none')
}

// music ctrl
jq('#local-music-played')
  .addEventListener('click',()=> MUSIC.paused() ? MUSIC.play() : MUSIC.pause())

jq('#local-music-volume')
  .addEventListener('click',function(e) {
    let ak = e.altKey,
        sk = e.shiftKey
    if (ak && sk) return
    if (sk) MUSIC.VPlus()
    if (ak) MUSIC.VReduce()
  })

jq('#local-music-loop')
  .addEventListener('click',()=> MUSIC.loop())

let bar = jq('.progress-bar-check div')

jq('.progress-bar-wrap')
  .addEventListener('click',function(e){
    let progress = e.offsetX / this.clientWidth * 100
    bar.style.width = progress + '%'
    MUSIC.currentTime = MUSIC.duration() * progress / 100
  })

const loopCtrl = setInterval(()=> {
  bar.style.width = (MUSIC.currentTime() / MUSIC.duration() * 100) + '%'
},1000)

module.exports = {
  db,
  set,
  get
}