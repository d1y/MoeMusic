(function () {
  const {BrowserWindow,shell} = require('electron')
  const path = require('path')
  ctrlInit = (c,m,b)=> {
      // Minimize task
      document.getElementById(m).addEventListener("click", (e) => {
          var window = BrowserWindow.getFocusedWindow();
          window.minimize();
      });

      // Maximize window
      document.getElementById(b).addEventListener("click", (e) => {
          var window = BrowserWindow.getFocusedWindow();
          if(window.isMaximized()){
              window.unmaximize();
          }else{
              window.maximize();
          }
      });
      // Close app
      document.getElementById(c).addEventListener("click", (e) => {
          var window = BrowserWindow.getFocusedWindow();
          window.close();
      });
  };
  document.onreadystatechange =  () => {
      if (document.readyState == "complete") {
          ctrlInit('window-closed','window-min','window-max')
      }
      window.onkeydown =  (e) => {
        let code = e.key
        if ( (code == 'r' || code == 'R') && (e.metaKey || e.ctrlKey) ){
          return false
        }
      }
  };
  let ajax = (arg) => {
    arg = arg || {}
    arg.type = (arg.type || 'get').toUpperCase()
    let params = formatParams(arg.data)
    let xhr = new XMLHttpRequest()
    function formatParams(data) {
       let arr = [];
       for (var name in data) {
           arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
       }
       return arr.join("&");
   }
   if (arg.type == "GET") {
           xhr.open("GET", arg.url + "?" + params, true);
           xhr.send(null);
   } else if (arg.type == "POST") {
           xhr.open("POST", arg.url, true);
           xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
           xhr.send(params);
  }
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
        let status = xhr.status;
        if (status >= 200 && status < 300) {
            arg.success && arg.success(xhr.responseText, xhr.responseXML);
        } else {
            arg.fail && arg.fail(status);
        }
    }
  }
}
window.localStorage.setItem('setting',JSON.stringify({
    "mass": 128,
    "dark": false,
    "API": 1
}))
let result = document.getElementById('result'),
    gSearch = document.getElementById('g_search'),
    gSubmit = document.getElementById('g_submit'),
    Music = document.getElementById('music')
    API = 'https://api.imjad.cn/cloudmusic/',
    playAPI_url = "https://music.163.com/song/media/outer/url?id=fuck.mp3",
    List = [],
    PY = document.getElementById('player'),
    SEARCH = (e)=>{
      let v = gSearch.value
      if ( v == '') return false
      ajax({
        type: 'get',
        url: API,
        data: {
          type: 'search',
          s: v
        },
        success: (data) => {
          data = JSON.parse(data)
          if ( data.code != '200') {
            result.innerHTML = '搜索失败了:('
            return
          }
          result.innerHTML = ''
          let p = document.createElement('p'),
              ul = document.createElement('ul')
          p.innerHTML = `搜索结果:  共有${data.result.songCount}首`
          result.appendChild(p)
          data.result.songs.forEach((item,index)=>{
            let li = document.createElement('li'),
                s = '',
                link = document.createElement('a')
            if ( item.ar instanceof Array ){
              item.ar.forEach((i) => {
                s += i.name + '/'
              })
            } else {
              s = item.ar.name
            }
            s = s.substr(0,s.length-1)
            List.push({
              'index': index,
              'href': `https://music.163.com/#/song?id=${item.id}`,
              'id': item.id,
              'pic': item.al.picUrl,
              'url': `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
              'name': item.name,
              'by': s
            })
            link.setAttribute('data-href',`https://music.163.com/#/song?id=${item.id}`)
            link.setAttribute('data-url',`https://music.163.com/song/media/outer/url?id=${item.id}.mp3`)
            link.innerHTML = `<span>${s} - ${item.name}</span>`
            link.addEventListener('click',(e)=>{
              PLAY(item.al.picUrl,item.name,s,link.getAttribute('data-url'),link.getAttribute('data-href'),index)
              musicStatus(item.name,s,link.getAttribute('pic-url'))
            },false)
            li.appendChild(link)
            ul.appendChild(li)
          })
          result.appendChild(ul)
        }
      })
      document.getElementById('musicPlayer').className += ' show'
      return false
    }
gSubmit.addEventListener('click',SEARCH,false)
gSearch.addEventListener('keydown',(e)=>{
  if (e.code == 'Enter'){
    SEARCH()
  }
})
let playCtrl = document.getElementById('player-ctrl'),
    musicStatus = (t,b) => {
      List = List || {}
      List.forEach((item,index)=>{
        let li = document.createElement('li'),
            link = document.createElement('a')
            link.setAttribute('data-href',`https://music.163.com/#/song?id=${item.id}`)
            link.setAttribute('data-url',`https://music.163.com/song/media/outer/url?id=${item.id}.mp3`)
            link.innerHTML = `<span>${item.by} - ${item.name}</span>`
            link.addEventListener('click',(e)=>{
              PLAY(item.pic,item.name,item.by,link.getAttribute('data-url'),link.getAttribute('data-href'),index)
              musicStatus(item.name,item.by)
            },false)
            li.appendChild(link)
            PY.getElementsByTagName('ul')[0].appendChild(li)
      })
      for (let i=0;i<2;i++){
        playCtrl.getElementsByTagName('span')[i].className = ''
      }
      if ( !Music.paused ){
        playCtrl.getElementsByTagName('span')[0].className = 'hide'
        Music.pause()
      } else {
        playCtrl.getElementsByTagName('span')[1].className = 'hide'
        Music.play()
        let msg = {
          title: `正在播放: ${t}`,
          body: `来自: ${b}`,
          icon: `http://0.0.0.0:3000/ass/moe.png`
        }
        new window.Notification(msg.title,msg)
      }
      let timeId
      setTimeout(()=>{
        timeId = setInterval(()=>{
            // console.log((Music.currentTime / Music.duration * 100).toString()+"%")
            document.getElementById('pb1').style
            .width = (Music.currentTime / Music.duration * 100).toString()+"%"
        },100)
      },3000)
    },
    playNext = document.getElementById('player-next'),
    playPrev = document.getElementById('player-prev'),
    _playIndex = 0,
    PLAY = (bg,name,by,src,share,INDEX)=>{
      BG = `url(${bg})`
      document.getElementById('musicCover').style
      .backgroundImage = BG
      document.getElementById('bg').style
      .backgroundImage = BG
      document.getElementById('song_title')
      .innerText = name
      document.getElementById('song_by')
      .innerText = by
      document.getElementById('download-file')
      .setAttribute('download',src)
      mass = new Number()
      switch ( JSON.parse(window.localStorage.getItem('setting')).mass ) {
        case 320:
            mass = 320
          break;
        case 192:
            mass = 192
          break;
        default:
            mass = 128
      }
      _playIndex = INDEX
      Music.setAttribute('src',src)
      Music.setAttribute('data-share',share)
    }
playCtrl.getElementsByTagName('span')[0].className = 'hide'
playCtrl.onclick = () =>{
  musicStatus(List[_playIndex].name,List[_playIndex].by)
}

let PN = (bl)=>{
  if (bl){
    if ( _playIndex >= List.length-1 ){
      _playIndex = List.length-1
      return
    }else {
      _playIndex++
    }
  } else{
    if ( _playIndex <= 0 ){
      _playIndex = 0
      return
    }else {
      _playIndex--
    }
  }
  let PLI = List[_playIndex]
  PLAY(PLI.pic,PLI.name,PLI.by,PLI.url,PLI.href,PLI.index)
  musicStatus(PLI.name,PLI.by,PLI.pic)
}
playNext.onclick = ()=> PN(true)
playPrev.onclick = ()=> PN(false)
document.getElementById('download-file').addEventListener('click',()=>{
  shell.openExternal(document.getElementById('download-file').getAttribute('download'))
})
document.getElementById('volume').addEventListener('click',(e)=>{
  document.getElementById('volumeWrap').className = 'show'
},false)
document.getElementById('volume-bar').addEventListener('click',(e)=>{
  document.getElementById('volumeBar').style
  .width = (e.offsetX / document.getElementById('volumeWrap').clientWidth * 100).toString() + '%'
})
document.getElementById('volume-bar').addEventListener('dblclick',(e)=>{
  document.getElementById('volumeWrap').className = ''
})
document.getElementById('volume-bar').addEventListener('click',(e)=>{
  Music.volume = e.offsetX / document.getElementById('volumeWrap').clientWidth
})
document.getElementById('share-ins').addEventListener('click',()=>{
  document.getElementById('share').className = 'show'
})
document.getElementById('share').addEventListener('click',()=>{
  if ( document.getElementById('share').className == 'show' ){
      document.getElementById('share').className = ''
      return
  }
})
document.getElementById('share-close').addEventListener('click',()=>{
  document.getElementById('share').className = ''
})
document.getElementById('musicPlayer').addEventListener('mouseover',()=>{
  document.getElementById('progress-bar').style
  .height = '20px'
})
document.getElementById('musicPlayer').addEventListener('mouseout',()=>{
  document.getElementById('progress-bar').style
  .height = '2px'
})
document.getElementById('pb1-copy').addEventListener('click',(e)=>{
  let tmp = e.offsetX / document.getElementById('volumeWrap').clientWidth
  Music.currentTime = tmp * Music.duration
  document.getElementById('pb1').style.width = (tmp * 100).toString() + '%'
  Music.play()
})
})();
