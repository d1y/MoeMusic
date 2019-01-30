function go() {
  window.location.reload()
}
let api = {
  search: require(`./api/module/search.js`),
  playlistHighquality: require(`./api/module/top_playlist_highquality.js`),
  playlistHot: require(`./api/module/playlist_hot.js`),
  end: require(`./api/util/request.js`),
  songUrl: require(`./api/module/song_url.js`),
  songDetail: require(`./api/module/song_detail.js`),
  searchHot: require(`./api/module/search_hot.js`),
  playlistDetail: require(`./api/module/playlist_detail.js`),
  lyric: require(`./api/module/lyric.js`),
  loginPhone: require(`./api/module/login_cellphone.js`),
  recommendSongs: require(`./api/module/recommend_songs.js`)
}
const mouseDown = require('./mousetrap.min')
$(() => {
  let themeQQ = parseInt(window.localStorage.getItem('theme')) || 0
  if (themeQQ) {
    $('body').addClass('dark')
  }
  $('.g-setting-dark').on('click', () => {
    $('body').addClass('dark')
    window.localStorage.setItem('theme', 1)
  })
  $('.g-setting-light').on('click', () => {
    $('body').removeClass('dark')
    window.localStorage.setItem('theme', 0)
  })
  $('#mySetting').on('click', () => $('.gSetting').fadeIn())
  $('#btnCleanHistory').on('click', () => {
    window.localStorage.removeItem('playlist')
    window.List = []
    $('#player ul').html('')
  })
  $('#search-played').on('keydown', b => {
    if ($('#search-played').val() == ''){
      LL(List)
      return
    }
    if (List.length <= 5) {
      return
    } else {
      let tt = []
      $(List).each((index, item) => {
        let tmp = (item.name + item.by).toLocaleUpperCase()
        if (tmp.indexOf($('#search-played').val().toLocaleUpperCase()) != -1) {
          tt.push(item)
        }
      })
      LL(tt)
    }
  })
  $('#g_menu').on('click', () => {
    $('.gMenu').eq(0).addClass('show')
  })
  $('.gSetting').hide()
  $('#gSetting-close').on('click', () => $('.gSetting').fadeOut())
  if (window.localStorage.getItem('user')) {
    let userPY = JSON.parse(window.localStorage.getItem('user'))
    $('#g-user img.fl').attr('src', userPY.img)
    $('.g-user-name').text(userPY.name)
    $('.g-user-desc').text(userPY.desc)
    $('#btnLogin').hide()
  } else {
    $('#g-user,#btnRecommend,#myPlaylist').hide()
  }
  $('.login-submit').on('click', () => {
    let mUser = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,
      mPd = /^(\w){6,20}$/
    if (mUser.test($('.login-user').val()) && mPd.test($('.login-password').val())) {
      api.loginPhone({
        phone: $('.login-user').val(),
        password: $('.login-password').val()
      }, api.end).then(ee => {
        console.log(ee);
        if (ee.body.code == 502) {
          $('.login-tips').html('账号或密码错误❎')
        } else if (ee.body.code == 200) {
          window.localStorage.setItem('ck', JSON.stringify(ee.cookie))
          $('#g-user').show()
          $('.login-wrap').removeClass('show')
          $('#g-user img.fl').attr('src', ee.body.profile.avatarUrl)
          $('.g-user-name').text(ee.body.profile.nickname)
          $('.g-user-desc').text(ee.body.profile.signature)
          window.localStorage.setItem('user', JSON.stringify({
            name: ee.body.profile.nickname,
            desc: ee.body.profile.signature,
            img: ee.body.profile.avatarUrl,
            id: ee.body.account.id
          }))
          $('#btnLogin').hide()
        }
      })
    } else {
      $('.login-tips').html('老哥,格式不对哦🌚')
    }
    return false
  })
  $('#btnSearch').on('click', SEARCH)
  $("#btnLogin").on('click', () => $('.login-wrap').addClass('show'))
  $('#search-close').on('click', () => $('.search-wrap').removeClass('show'))
  $('#login-exit').on('click', () => $('.login-wrap').removeClass('show'))
  $('.login-user').on('focus', () => $('.login-wrap .login-img').css({
    'backgroundColor': 'yellow'
  }))
  $('.login-password').on('focus', () => $('.moe-mask').addClass('show'))
  $('.login-submit').on('mouseover', () => {
    $('.moe-mask').removeClass('show')
    $('.moe-warring').toggleClass('show')
  })
  $('#g_search').on('keydown', e => {
    let b = $('#g_search').val()
    if (b == '' || b == ' ') return
    if (e.key == 'Escape') {
      $('.search-wrap').removeClass('show')
      return
    }
    if (e.key == 'Enter') {
      search(b)
    }
  })
  let search = (va) => {
    let l = window.localStorage.getItem('search_limit') || '20'
    api.search({
      keywords: va,
      limit: l
    }, api.end).then(e => {
      $('#result').html('')
      let p = $('<p>', {
        html: `搜索结果:  共有${e.body.result.songCount}首`
      })
      $('#result').append(p)
      ul = $('<ul>')
      if (e.status != 200) {
        console.error('搜索失败');
        $('#result').html('搜索失败')
      }
      $(e.body.result.songs).each((index, item) => {
        let by = '',
          li = $('<li>')
        $(item.artists).each((index, as) => {
          by += as.name + '/'
        })
        by = by.substr(0, by.length - 1)
        let link = $('<a>', {
          'data-name': item.name,
          'data-url': `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
          'data-by': by,
          'data-id': item.id,
          html: `<span>${by} - ${item.name}</span>`
        })
        link.on('click', () => {
          let isListPush = false
          api.songDetail({
            ids: link.attr('data-id')
          }, api.end).then(c => {
            let tmp = {
              'share': `https://music.163.com/m/song?id=${item.id}`,
              'id': item.id,
              'url': `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
              'name': item.name,
              'by': by,
              'pic': c.body.songs[0].al.picUrl,
            }
            List.forEach((item, index) => {
              if (item.url == tmp.url) {
                isListPush = true
                return
              }
            })
            if (!isListPush) {
              window.List.push(tmp)
              window.localStorage.setItem('playlist', JSON.stringify(List))
            }
            played({
              pic: c.body.songs[0].al.picUrl,
              url: link.attr('data-url'),
              name: link.attr('data-name'),
              by: link.attr('data-by'),
              id: link.attr('data-id')
            })
            musicStatus()
          })
        })
        li.append(link)
        ul.append(li)
      })
      $('#result').append(p)
      $('#result').append(ul)
    })
  }
  let Music = $('#music')[0]
  let played = (arg) => {
      arg = arg || {}
      $('#bg,#musicCover,.bg-blur,#player-mask,.mask').css('backgroundImage', `url(${arg.pic})`)
      $('#musicPlayer').addClass('show')
      $('#music').attr({
        'src': arg.url,
        'data-name': arg.name,
        'data-by': arg.by,
        'data-pic': arg.pic,
        'data-share': `https://music.163.com/m/song?id=${arg.id}`
      })
      $('#song_title').html(arg.name)
      $('#song_by').html(arg.by)
      window.LL = l => {
        let PY = $('#player')[0]
        PY.getElementsByTagName('ul')[0].innerHTML = ''
        l.forEach((item, index) => {
          let li = document.createElement('li'),
            link = document.createElement('a'),
            btn = document.createElement('button'),
            span = document.createElement('span')
          link.setAttribute('data-href', item.href)
          link.setAttribute('data-url', item.url)
          link.setAttribute('data-name', item.name)
          link.setAttribute('data-by', item.by)
          link.className = 'clearfix'
          link.setAttribute('data-index', index)
          span.innerHTML = `${item.by} - ${item.name}`
          span.className = 'fl'
          span.addEventListener('click', (e) => {
            Music.setAttribute('index', link.getAttribute('data-index'))
            played({
              url: item.url,
              name: item.name,
              by: item.by,
              pic: item.pic,
              id: item.id
            })
            musicStatus()
          }, false)
          btn.className = 'list-del fr'
          btn.innerHTML = '删除'
          let breakFlag = false
          btn.onclick = () => {
            let pa = $(btn).parent().attr('data-url')
            $(btn).parent().parent().remove()
            $(List).each((index, item) => {
              if (breakFlag) return false
              if (item.url == pa) {
                breakFlag = true
                window.List.splice(index, 1)
              }
            })
            window.localStorage.setItem('playlist', JSON.stringify(List))
            if (pa == music.src) PN(1)
          }
          link.appendChild(span)
          link.appendChild(btn)
          li.appendChild(link)
          PY.getElementsByTagName('ul')[0].appendChild(li)
        })
      }
      LL(List)
    },
    musicStatus = () => {
      MusicInfo()
      getID('musicPlayer').className = 'show'
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
          icon: `./assets/moe.png`
        }
        new window.Notification(msg.title, msg)
      }
      let timeId
      setTimeout(() => {
        timeId = setInterval(() => {
          getID('pb1').style
            .width = (Music.currentTime / Music.duration * 100).toString() + "%"
          if (Music.ended) {
            switch (mode) {
              case 'order':
                Music.removeAttribute('loop')
                clearInterval(timeId)
                PN(true)
                break;
              case 'random':
                console.log('random');
                Music.removeAttribute('loop')
                clearInterval(timeId)
                let dom = () => {
                    return Math.floor(Math.random() * (List.length - 1) + 1)
                  },
                  e = dom()
                console.log(e);
                Music.setAttribute('index', e)
                played({
                  pic: List[e].pic,
                  name: List[e].name,
                  by: List[e].by,
                  url: List[e].url,
                  href: List[e].href,
                  id: List[e].id
                })
                musicStatus()
                break;
              case 'loop':
                Music.setAttribute('loop', 'loop')
                break;
            }
          }
        }, 1000)
      }, 2000)
    },
    getID = (e) => {
      return document.getElementById(e)
    }
  $('#player-ctrl').on('click', musicStatus)
  $('#musicPlayer').on('mouseover', () => $('#progress-bar').addClass('show'))
  $('#musicPlayer').on('mouseout', () => $('#progress-bar').removeClass('show'))
  $('#pb1-copy').on('click', (e) => {
    let tmp = e.offsetX / getID('volumeWrap').clientWidth
    Music.currentTime = tmp * Music.duration
    getID('pb1').style.width = (tmp * 100).toString() + '%'
    for (let i = 0; i < 2; i++) {
      getID('player-ctrl').getElementsByTagName('span')[i].className = ''
    }
    getID('player-ctrl').getElementsByTagName('span')[1].className = 'hide'
    Music.play()
  })
  getID('playlist').onclick = () => $('#player').addClass('show')
  getID('volume').addEventListener('click', (e) => {
    getID('volumeWrap').className = 'show'
  }, false)
  getID('volumeBar').style.width = (Music.volume * 100).toString() + "%"
  let isClickEnd
  getID('volume-bar').addEventListener('click', (e) => {
    clearTimeout(isClickEnd);
    isClickEnd = setTimeout(function() {
      getID('volumeBar').style
        .width = (e.offsetX / getID('volumeWrap').clientWidth * 100).toString() + '%'
    }, 50);
  })
  getID('volume-bar').addEventListener('dblclick', (e) => {
    clearTimeout(isClickEnd);
    getID('volumeWrap').className = ''
  })
  getID('volume-bar').addEventListener('click', (e) => {
    Music.volume = e.offsetX / getID('volumeWrap').clientWidth
  })
  getID('share-ins').addEventListener('click', () => {
    if (!$(Music).attr('data-share')) return
    $('.qrcode').eq(0).
    attr('src', `https://qrickit.com/api/qr.php?d=${$(Music).attr('data-share')}`)
    $('.share-name').eq(0).text($(Music).attr('data-name'))
    $('.share-by').eq(0).text($(Music).attr('data-by'))
    getID('share').className = 'show'
    getID('share').style
      .backgroundImage = `url(${$(Music).attr('data-pic')})`
  })
  getID('share').addEventListener('click', () => {
    if (getID('share').className == 'show') {
      getID('share').className = ''
      return
    }
  })
  let mode = 'order'
  $('.mode-wrap').on('click', () => $('.mode-wrap').removeClass('show'))
  getID('mode-loop').onclick = () => {
    Music.setAttribute('loop', 'loop')
    mode = 'loop'
  }
  getID('mode-random').onclick = () => {
    Music.removeAttribute('loop')
    mode = 'random'
  }
  getID('mode-order').onclick = () => {
    Music.removeAttribute('loop')
    mode = 'order'
  }
  $('.playlist-detail').hide()
  let MusicInfo = () => {
    let tmpBg = Music.getAttribute('data-pic')
    getID('last').style
      .backgroundImage = `url(${tmpBg})`
    $('.player-cover-mask')[0].style
      .backgroundImage = `url(${tmpBg})`
    let sid = Music.getAttribute('data-share').substr((Music.getAttribute('data-share').indexOf('id=') + 3))
    api.lyric({
      id: sid
    }, api.end).then(e => {
      if (e.body.nolyric || e.body.uncollected) {
        console.log('没有找到歌词🍭');
        $('#player-lyric ul').html('')
        let a = $('<a>', {
          class: 'no-lyric',
          html: '没有找到歌词👀,可能是纯音乐 🚥 ~'
        })
        $('#player-lyric .player-lyric').append(a)
        return
      }
      a = parseLyric(e.body.lrc.lyric)
      $('#player-lyric ul').html('')
      for (let i in a) {
        let li = $('<li>', {
          'data-time': i,
          html: a[i]
        })
        li.on('click', () => {
          Music.currentTime = li.attr('data-time')
        })
        $('#player-lyric .player-lyric').append(li)
      }

      function parseLyric(lrc) {
        var lyrics = lrc.split("\n");
        var lrcObj = {};
        for (var i = 0; i < lyrics.length; i++) {
          var lyric = decodeURIComponent(lyrics[i]);
          var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
          var timeRegExpArr = lyric.match(timeReg);
          if (!timeRegExpArr) continue;
          var clause = lyric.replace(timeReg, '');
          for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
              sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lrcObj[time] = clause;
          }
        }
        return lrcObj;
      }
    })
  }
  getID('musicCover').addEventListener('click', () => {
    if ($('.player-cover').hasClass('show')) return
    MusicInfo()
    $('.player-cover').addClass('show')
  })
  mouseDown.bind(['ctrl+c', 'f f f'], e => {
    if ($('.player-cover').hasClass('show')) return
    MusicInfo()
    $('.player-cover').addClass('show')
    // $('#musicCover').trigger('click')
  })
  getID('player-cover-close').addEventListener('click', () => {
    $('.player-cover').removeClass('show')
  })
  window.List = JSON.parse(localStorage.getItem('playlist')) || [{
    "by": "Hardwell/Atmozfears/M.BRONX",
    "href": "https://music.163.com/m/song?id=493043002",
    "id": 493043002,
    "name": "All That We Are Living For",
    "pic": "https://p2.music.126.net/yWVujDesdI4GMbGjmOFiiQ==/18991864346840353.jpg",
    "url": "https://music.163.com/song/media/outer/url?id=493043002.mp3"
  }]
  let lastPlay = List[List.length - 1]
  played({
    pic: lastPlay.pic,
    url: lastPlay.url,
    name: lastPlay.name,
    by: lastPlay.by,
    id: lastPlay.id
  })
  Music.setAttribute('index', List.length - 1)
  let PN = (bl) => {
    if (List.length == 0) return
    let PLI, ie = parseInt(Music.getAttribute('index'))
    if (!Music.getAttribute('index') || List.length == 1) return
    if (bl) {
      if (ie >= List.length - 1) {
        ie = 0
      } else {
        ie++
      }
    } else {
      if (ie <= 0) {
        ie = List.length - 1
      } else {
        ie--
      }
    }
    PLI = List[ie]
    Music.setAttribute('index', ie)
    played({
      pic: PLI.pic,
      url: PLI.url,
      name: PLI.name,
      by: PLI.by,
      id: PLI.id
    })
    musicStatus()
  }
  getID('player-next').onclick = () => PN(true)
  getID('player-prev').onclick = () => PN(false)
  let playHot = (tag) => {
    api.playlistHighquality({
      cat: tag,
      limit: window.localStorage.getItem('playlist-limit') || 30
    }, api.end).then(data => {
      if (data.body.msg == '没有获取数据') {
        $('#playlist-hot').html('<p align="center">没有获取到数据哦🌚,你可以试试其他标签呢🌦<br><img src="http://img.soogif.com/kVdxqXzJ7IpswMtcn60S99m8g04ihEQd.gif"></p>')
        return
      }
      $('#playlist-hot').html('')
      data.body.playlists.forEach((rs) => {
        li = document.createElement('li')
        a = document.createElement('a')
        img = document.createElement('img')
        p1 = document.createElement('p')
        p2 = document.createElement('p')
        a.href = 'javascript:void(0)'
        a.setAttribute('data-id', rs.id)
        $(a).on('click', () => {
          $('.playlist-list').html('')
          api.playlistDetail({
            id: rs.id
          }, api.end).then(e => {
            let createDate = new Date(e.body.playlist.createTime),
              s = `${createDate.getFullYear()}-${createDate.getMonth()}-${createDate.getDate()}`
            $('#playlist-header-mask').css('background-image', `url(${e.body.playlist.coverImgUrl})`)
            $('#playlist-header-cover').css('backgroundImage', `url('${e.body.playlist.coverImgUrl}')`)
            $('.playlist-title').text(`"${e.body.playlist.name}"`)
            $('.playlist-cover-img').attr('src', e.body.playlist.creator.avatarUrl)
            $('.playlist-created').html(`${e.body.playlist.creator.nickname} 创建于 ${s}`)
            let imTag = ''
            e.body.playlist.tags.forEach(im => {
              imTag += im + ' '
            })
            $('.playlist-tags').html(`标签: ${imTag}`)
            $('.playlist-desc').text(`${e.body.playlist.description}`)
            $('.playlist-detail').fadeIn('slow')
            e.body.playlist.tracks.forEach((pp, index) => {
              let lii = ''
              pp.ar.forEach(il => {
                lii += il.name + '/'
              })
              lii = lii.substr(0, lii.length - 1)
              let ll = $('<li>'),
                a = $('<a>', {
                  href: "javascript:void(0)",
                  html: `${lii} - ${pp.name}`,
                  'data-id': e.body.playlist.trackIds[index].id,
                  'data-pic': pp.al.picUrl
                })
              a.on('click', () => {
                let isListPush = false
                let tmp = {
                  'share': `https://music.163.com/m/song?id=${e.body.playlist.trackIds[index].id}`,
                  'id': e.body.playlist.trackIds[index].id,
                  'url': `https://music.163.com/song/media/outer/url?id=${e.body.playlist.trackIds[index].id}.mp3`,
                  'name': pp.name,
                  'by': lii,
                  'pic': pp.al.picUrl
                }
                List.forEach((item, index) => {
                  if (item.url == tmp.url) {
                    isListPush = true
                    return
                  }
                })
                if (!isListPush) {
                  window.List.push(tmp)
                  window.localStorage.setItem('playlist', JSON.stringify(List))
                }

                played({
                  pic: pp.al.picUrl,
                  url: `https://music.163.com/song/media/outer/url?id=${e.body.playlist.trackIds[index].id}.mp3`,
                  name: pp.name,
                  by: lii,
                  id: e.body.playlist.trackIds[index].id
                })
                musicStatus()
              })
              ll.append(a)
              $('.playlist-list').append(ll)
            })
          })
          return false
        })
        p1.className = 'list-hot-info'
        p1.setAttribute('data-id', '🤟' + rs.creator.nickname)
        p1.setAttribute('data-count', '👏' + rs.playCount)
        img.src = rs.coverImgUrl
        p2.className = 'list-hot-name'
        p2.innerHTML = rs.name
        li.appendChild(a)
        p1.appendChild(img)
        a.appendChild(p1)
        a.appendChild(p2)
        getID('playlist-hot').appendChild(li)
      })
    })
  }
  playHot('电子')

  $('#playlist-header-close').on('click', () => {
    $('.playlist-detail').fadeOut()
  })
  $('.tag a').each((index, item) => {
    $(item).on('click', () => {
      playHot($(item).text())
    })
  })

  // 菜单
  $('.py-p').on('click', e => {
    PN(false)
  })
  $('.py-n').on('click', e => {
    PN(true)
  })
  $('.py-e').on('click', musicStatus)
  $('.py-a').on('click', e => $('#playlist').trigger('click'))
  $('.py-f').on('click', SEARCH)
  $('.py-d').on('click', e => $('#download-file').trigger('click'))
  $('.py-t').on('click', e => {
    $('body').toggleClass('dark')
  })
  $('.py-s').on('click', e => $('#share-ins').trigger('click'))
  $('.py-st').on('click', e => $('.gSetting').fadeIn())
  // 快捷键
  mouseDown.bind('tab', e => {
    return false
  })
  mouseDown.bind('space', e => {
    musicStatus()
    return false
  })
  mouseDown.bind(['command+f', 'ctrl+f'], SEARCH)
  mouseDown.bind(['command+m', 'ctrl+m'], () => $('.gMenu').toggleClass('show'))
  mouseDown.bind('esc', () => {
    $('.playlist-detail').hide()
    $('.gMenu,#player,.search-wrap,.login-wrap,.player-cover').removeClass('show')
  })
  mouseDown.bind(['command+p', 'ctrl+p'], () => $('#musicPlayer').toggleClass('show'))
  mouseDown.bind('ctrl+a', () => $('#playlist').trigger('click'))
  mouseDown.bind('ctrl+tab', () => {
    $('.mode-wrap').toggleClass('show')
  })
  mouseDown.bind(['ctrl+1', 'left'], e => PN(false))
  mouseDown.bind(['ctrl+2', 'right'], e => PN(true))
  mouseDown.bind(['ctrl+3', 'up'], e => {
    if (Music.volume >= 0.9) return
    Music.volume += 0.1
    $('#volumeBar').css({
      width: (Music.volume * 100).toString() + '%'
    })
  })
  mouseDown.bind(['ctrl+4', 'down'], e => {
    if (Music.volume <= 0.2) return
    Music.volume -= 0.1
    $('#volumeBar').css({
      width: (Music.volume * 100).toString() + '%'
    })
  })
  mouseDown.bind('1', e => {
    Music.currentTime -= 5
  })
  mouseDown.bind('2', e => {
    Music.currentTime += 5
  })
})
let SEARCH = () => {
  $('.search-wrap').toggleClass('show')
  $('#g_search').focus()
  $('#search-hot').html('')
  api.searchHot({}, api.end).then(e => {
    e.body.result.hots.forEach(item => {
      let tg = $('<a>', {
        html: item.first,
        href: 'javascript:void(0)'
      })
      tg.on('click', () => {
        $('#g_search').val(tg.html())
      })
      $('#search-hot').append(tg)
    })
  })
  if (!navigator.onLine) {
    console.log('你似乎没有网络🤯');
  }
}
const menu = document.getElementById('menu');
let menuVisible = false;
$(menu).hide()
const toggleMenu = command => {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
};

const setPosition = ({
  top,
  left
}) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  toggleMenu("show");
};

window.addEventListener("click", e => {
  if (menuVisible) toggleMenu("hide");
});

window.addEventListener("contextmenu", e => {
  e.preventDefault();
  const origin = {
    left: e.pageX,
    top: e.pageY
  };
  if (e.pageX + $(menu).width() >= 900) {
    origin.left = 900 - $(menu).width() - 4
  }
  if (e.pageY + $(menu).height() > 600) {
    origin.top = 600 - $(menu).height() - 4
  }
  setPosition(origin);
  return false;
});
let mmm = new Audio()
mmm.volume = 0.1
$(window).on('click', e => {
  mmm.src = './assets/jump.mp3'
  mmm.play()
})
