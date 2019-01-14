(function() {
  ajax = (arg) => {
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
  },
  getID = (e) => {
    return document.getElementById(e)
  },
  getFirst = (e) => {
    return document.getElementsByClassName(e)[0]
  }
  SEARCH = (e) => {
    let v = getID('g_search').value,
        tmpList = []
    if (v == '') return false
    ajax({
      type: 'get',
      url: API,
      data: {
        type: 'search',
        s: v
      },
      success: (data) => {
        data = JSON.parse(data)
        if (data.code != '200') {
          result.innerHTML = '搜索失败了:('
          return
        }
        getID('result').innerHTML = ''
        let p = document.createElement('p'),
            ul = document.createElement('ul')
        p.innerHTML = `搜索结果:  共有${data.result.songCount}首`
        getID('result').appendChild(p)
        data.result.songs.forEach((item, index) => {
          let li = document.createElement('li'),
            s = '',
            link = document.createElement('a')
          if (item.ar instanceof Array) {
            item.ar.forEach((i) => {
              s += i.name + '/'
            })
          } else {
            s = item.ar.name
          }
          s = s.substr(0, s.length - 1)
          tmpList.push({
            'index': index,
            'href': `https://music.163.com/m/song?id=${item.id}`,
            'id': item.id,
            'pic': item.al.picUrl,
            'url': playAPI_url.replace('fuck', item.id),
            'name': item.name,
            'by': s
          })
          link.setAttribute('data-href', `https://music.163.com/m/song?id=${item.id}`)
          link.setAttribute('data-url', playAPI_url.replace('fuck', item.id))
          link.innerHTML = `<span>${s} - ${item.name}</span>`
          link.addEventListener('click', (e) => {
            let isListPush = false
            List.forEach((item)=>{
              if (item.url == tmpList[index].url){
                isListPush = true
              }
            })
            if (!isListPush) {
              window.List.push(tmpList[index])
              window.localStorage.setItem('playlist',JSON.stringify(List))
            }
            Music.setAttribute('index', List.length - 1)
            PLAY(item.al.picUrl, item.name, s, link.getAttribute('data-url'), link.getAttribute('data-href'), List[List.length-1])
            musicStatus()
          }, false)
          li.appendChild(link)
          ul.appendChild(li)
        })
        getID('result').appendChild(ul)
      }
    })
    getID('musicPlayer').className += ' show'
    return false
  }
  musicStatus = () => {
    for (let i = 0; i < 2; i++) {
      getID('player-ctrl').getElementsByTagName('span')[i].className = ''
    }
    if (!Music.paused) {
      getID('player-ctrl').getElementsByTagName('span')[0].className = 'hide'
      Music.pause()
    } else {
      getID('player-ctrl').getElementsByTagName('span')[1].className = 'hide'
      Music.play()
      let msg = {
        title: `正在播放: ${getID('music').getAttribute('data-name')}`,
        body: `来自: ${getID('music').getAttribute('data-by')}`,
        icon: `http://0.0.0.0:3000/assets/moe.png`
      }
      new window.Notification(msg.title, msg)
    }
    let timeId
    setTimeout(() => {
      timeId = setInterval(() => {
        getID('pb1').style
          .width = (Music.currentTime / Music.duration * 100).toString() + "%"
        if (Music.ended){
          switch (mode) {
            case 'order':
                Music.removeAttribute('loop')
                clearInterval(timeId)
                PN(true)
                break;
            case 'random':
                Music.removeAttribute('loop')
                clearInterval(timeId)
                // 作用域不同,所以每次获取到一个随机数必须是一个函数!
                let dom = () => {
                  return Math.floor(Math.random() * (List.length - 1) + 1)
                }, e = dom()
                Music.setAttribute('index',e)
                PLAY(List[e].pic, List[e].name, List[e].by, List[e].url, List[e].href)
                musicStatus()
                break;
            case 'loop':
                Music.setAttribute('loop','loop')
                break;
          }
        }
      }, 1000)
    }, 2000)
  }
  PLAY = (bg, name, by, src, share) => {
    BG = `url(${bg})`
    getID('musicCover').style
      .backgroundImage = BG
    getID('bg').style
      .backgroundImage = BG
    getID('song_title')
      .innerText = name
    getID('song_by')
      .innerText = by
    getID('download-file')
      .setAttribute('download', src)
    Music.setAttribute('data-pic', bg)
    Music.setAttribute('src', src)
    Music.setAttribute('data-share', share)
    Music.setAttribute('data-name', name)
    Music.setAttribute('data-by', by)
    PY.getElementsByTagName('ul')[0].innerHTML = ''
    List.forEach((item, index) => {
      let li = document.createElement('li'),
          link = document.createElement('a')
      link.setAttribute('data-href', `https://music.163.com/m/song?id=${item.id}`)
      link.setAttribute('data-url', playAPI_url.replace('fuck', item.id))
      link.innerHTML = `<span>${item.by} - ${item.name}</span>`
      link.setAttribute('data-index',index)
      link.addEventListener('click', (e) => {
        Music.setAttribute('index',link.getAttribute('data-index'))
        PLAY(item.pic, item.name, item.by, link.getAttribute('data-url'), link.getAttribute('data-href'))
        musicStatus()
      }, false)
      li.appendChild(link)
      PY.getElementsByTagName('ul')[0].appendChild(li)
    })
  }
  // ==========
  let Music = getID('music'),
      PY = getID('player'),
      API = 'https://api.imjad.cn/cloudmusic/',
      playAPI_url = "https://music.163.com/song/media/outer/url?id=fuck.mp3",
      mode = 'order'
  // ===========
  let auto = ()=>{
    window.List = JSON.parse(localStorage.getItem('playlist')) || [{
      "by":"Hardwell/Atmozfears/M.BRONX",
      "href":"https://music.163.com/m/song?id=493043002",
      "id":493043002,
      "index":1,
      "name":"All That We Are Living For",
      "pic":"https://p2.music.126.net/yWVujDesdI4GMbGjmOFiiQ==/18991864346840353.jpg",
      "url":"https://music.163.com/song/media/outer/url?id=493043002.mp3"
    }]
    let autoLastPlay = List[List.length-1]
    PLAY(autoLastPlay.pic, autoLastPlay.name, autoLastPlay.by, autoLastPlay.url, autoLastPlay.href)
  }
  auto()
  getID('g_submit').addEventListener('click', SEARCH, false)
  getID('g_search').addEventListener('keydown', (e) => {
    if (e.code == 'Enter') {
      SEARCH()
    }
  })
  getID('player-ctrl').getElementsByTagName('span')[0].className = 'hide'
  getID('player-ctrl').onclick = musicStatus

  let PN = (bl) => {
    let PLI,ie = parseInt(Music.getAttribute('index'))
    if (!Music.getAttribute('index') || List.length == 1) return
    if (bl) {
      if (ie >= List.length - 1) {
        ie=0
      } else {
        ie++
      }
    } else {
      if (ie <= 0) {
        ie= List.length - 1
      } else {
        ie--
      }
    }
    PLI = List[ie]
    Music.setAttribute('index',ie)
    PLAY(PLI.pic, PLI.name, PLI.by, PLI.url, PLI.href)
    musicStatus()
  }
  getID('player-next').onclick = () => PN(true)
  getID('player-prev').onclick = () => PN(false)
  getID('download-file').addEventListener('click', () => {
    shell.openExternal(getID('download-file').getAttribute('download'))
  })
  getID('volume').addEventListener('click', (e) => {
    getID('volumeWrap').className = 'show'
  }, false)
  getID('volumeBar').style.width = (Music.volume * 100).toString() + "%"
  getID('volume-bar').addEventListener('click', (e) => {
    getID('volumeBar').style
      .width = (e.offsetX / getID('volumeWrap').clientWidth * 100).toString() + '%'
  })
  getID('volume-bar').addEventListener('dblclick', (e) => {
    getID('volumeWrap').className = ''
  })
  getID('volume-bar').addEventListener('click', (e) => {
    Music.volume = e.offsetX / getID('volumeWrap').clientWidth
  })
  getID('share-ins').addEventListener('click', () => {
    if (!Music.getAttribute('data-share')) {
      return
    }
    getFirst('qrcode').
    setAttribute('src', `http://mobile.qq.com/qrcode?url=${Music.getAttribute('data-share')}`)
    getFirst('share-name').innerText = Music.getAttribute('data-name')
    getFirst('share-by').innerText = Music.getAttribute('data-by')
    getID('share').className = 'show'
    getID('share').style
      .backgroundImage = `url(${Music.getAttribute('data-pic')})`
  })
  getID('share').addEventListener('click', () => {
    if (getID('share').className == 'show') {
      getID('share').className = ''
      return
    }
  })
  getID('musicPlayer').addEventListener('mouseover', () => {
    getID('progress-bar').style
      .height = '20px'
  })
  getID('musicPlayer').addEventListener('mouseout', () => {
    getID('progress-bar').style
      .height = '2px'
  })
  getID('pb1-copy').addEventListener('click', (e) => {
    let tmp = e.offsetX / getID('volumeWrap').clientWidth
    Music.currentTime = tmp * Music.duration
    getID('pb1').style.width = (tmp * 100).toString() + '%'
    for (let i = 0; i < 2; i++) {
      getID('player-ctrl').getElementsByTagName('span')[i].className = ''
    }
    getID('player-ctrl').getElementsByTagName('span')[1].className = 'hide'
    Music.play()
  })
  getID('playlist').onclick = () => PY.className = 'show'
  document.getElementsByTagName('body')[0].onclick = (e) => {
    let isShow = 0
    e.path.forEach((item) => {
      if (item === getID('playlist')) {
        isShow = 1
        return
      }
    });
    if (isShow) {
      return
    } else {
      PY.className = ''
    }
  }
  getFirst('play-mode').onclick = ()=>{
    getFirst('mode-wrap').className = 'mode-wrap show'
  }
  getFirst('mode-wrap').onclick = ()=>{
    getFirst('mode-wrap').className = 'mode-wrap'
  }
  getID('mode-loop').onclick = ()=>{
    Music.setAttribute('loop','loop')
    mode = 'loop'
  }
  getID('mode-random').onclick = ()=> {
    Music.removeAttribute('loop')
    mode = 'random'
  }
  getID('mode-order').onclick = ()=> {
    Music.removeAttribute('loop')
    mode = 'order'
  }
})()
