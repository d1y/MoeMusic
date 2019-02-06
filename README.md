<p align="center">
  <img src="https://files.catbox.moe/my1mh6.png" width="20%">
</p>

<p align="center">
<img src="https://img.shields.io/badge/Bilibili-Kozo4-blue.svg">
<img src="https://img.shields.io/badge/Release-0.0.1beta-brightgreen.svg">
<img src="https://img.shields.io/badge/codingMood-🍭🍭🍭-brightgreen.svg">
</p>

<h2 align="center">MoeMusic</h2>

<a href="README_cn.md">👉中文看这里👈</a> `MoeMusic` is a music player based on `electorn`🎸 (`mm` for short)🎧, but its connotation is far more than a music player👋 . I hope it can replace your girlfriend's API service❤️. Netease CloudMusic Api is based on: [Binaryify / Netease CloudMusic](https://github.com/Binaryify/NeteaseCloudMusicApi). Thank you for helping me.

<p align="center">
<!-- <img src="https://i.loli.net/2019/02/05/5c597cf6ace97.png"> -->
<img src="https://i.loli.net/2019/01/20/5c4496d7ae265.png">
</p>

## screenshot👇🏻

> GIF is too big!

### player

![](https://i.loli.net/2019/02/06/5c5aba941158a.gif)

### search

![](https://i.loli.net/2019/02/06/5c5abaa789777.gif)

### theme & contentmenu

![](https://i.loli.net/2019/02/06/5c5abab58eb2e.gif)

## build

Selector is all right, but it's too big. You can compile it yourself. I assume you have a simple `command line` + `nodejs` + `git` base.

```bash
  git clone https://github.com/d1y/moemusic
  cd moemusic && yarn
  # api
  yarn run api
  # build all
  yarn run dist-all
  # win
  yarn run dist-win
  # mac
  yarn run dist-mac
  # linux
  yarn run dist-linux
```

**PS: I strongly recommend that you install electron and use my source code directly..**

```bash
  # install electron
  yarn global add electron
  npm i -g electorn
  # add alias
  echo "alias mm='electorn path'" >> ~/.zshrc # path = clone好的目录
  # use
  mm
```

## 使用

### Shortcut keys

Mm has vim-like shortcuts keys

| key                   | function                 |
|:--------------------- |:------------------------ |
| `ctrl+m` & `⌘+m`      | menu                     |
| `ctrl+a` & `⌘+a`      | playlist                 |
| `ctrl+p` & `⌘+p`      | player                   |
| `ctrl+f`              | search                   |
| `space`               | play & pause             |
| `ctrl+1` & `←`        | prev songs               |
| `ctrl+2` & `→`        | next songs               |
| `ctrl+3` &`↑`         | volume+                  |
| `ctrl+4` &`↓`         | volume-                  |
| `ctrl+tab`            | music mode check         |
| `1`                   | Music time-5s            |
| `2`                   | Music time+5s            |
| `esc`                 | Exit all secondary menus |
| `w o y a o m e i z i` | bug2333                  |

It is worth mentioning that although mm wants to be your girlfriend, she will not abuse the global shortcuts excessively, so all the above shortcuts will only take effect when the window gets the focus.

### function

I know you're still eager to try.
`mm` Current support:

#### White noise

`woootf`,It's necessary.

Originality and ideas come from noizio on the same Mac platform

> Noizio functions are simple, but there are many sound types. Although these sounds are not translated in Chinese, these words are relatively simple, and there are corresponding icons for easy identification. In fact, it won't waste much time to listen to each one once. In short, it's easy to understand what kind of environment these sounds are.
> You can turn on only one sound, or you can simulate different environments by combining different sounds, such as turning on summer night + waves + fires, to simulate sitting on the beach and enjoying the night sky. It is often used to listen during the lunch break. Sleep quality improves obviously. Of course, you can also open the combination of cafe and deep space, and imagine sitting in a space cafe, watching the stars while tasting coffee.

## about

> 自豪的使用: 百度翻译
>
> <p align="center">
>   <img src="https://i.loli.net/2019/01/15/5c3dd5904907a.png">
> </p>

## TODO

- [ ] 模型妹子一定要有(女朋友啊!!)
- [x] 白噪音功能(可以深度学习)
- [ ] 更完善的搜索功能
- [ ] 多接口(`QQ`+`酷狗`+`..`)
- [x] 用户可自定义的设置(比如，默认下载的音质)
- [ ] 一定要有调音器,这必须的,这个`app`面向是电子音乐用户
- [ ] 手机端
- [x] 登录功能(`20%`)
- [x] 一定要有炫酷的播放特效(比如`音波`)
- [x] 多主题,切换主题
- [x] 歌曲推荐
