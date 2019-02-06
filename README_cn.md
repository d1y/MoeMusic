<p align="center">
  <img src="https://files.catbox.moe/my1mh6.png" width="20%">
</p>

<p align="center">
<img src="https://img.shields.io/badge/Bilibili-Kozo4-blue.svg">
<img src="https://img.shields.io/badge/Release-0.0.1beta-brightgreen.svg">
<img src="https://img.shields.io/badge/codingMood-🍭🍭🍭-brightgreen.svg">
</p>

<h2 align="center"> MoeMusic </h2>

`MoeMusic`是一个基于`electorn`🎸的音乐播放器🎧(以下简称`mm`),但她的内涵远远不止一个音乐播放器那么简单👋 ,我希望它能够代替你女朋友的❤️. 网易云的`API`服务是基于的:
 [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi). 谢谢帮助过我的人

<p align="center">
<!-- <img src="https://i.loli.net/2019/02/05/5c597cf6ace97.png"> -->
<img src="https://i.loli.net/2019/01/20/5c4496d7ae265.png">
</p>

## 截图👇🏻

> GIF太大了,流量党当心!

### 播放

![](https://i.loli.net/2019/02/06/5c5aba941158a.gif)

### 搜索

![](https://i.loli.net/2019/02/06/5c5abaa789777.gif)

### 主题切换 & 右击菜单

![](https://i.loli.net/2019/02/06/5c5abab58eb2e.gif)

## 下载 & 安装 & build

**怎么样,看到部分截图是否动心了呢 🤩 ?**

### 下载

国内由于众所周知的原因,所以下载非常非常慢,甚至无法下载,所以迫于淫威之下,你可以选择在这个中转服务站下载(下载按钮依次是: `win` | `macos` | `linux-AppImage`)

<a href="http://tmp.link/f/5c5ab1dfc9e9d">
  <img src="https://openclipart.org/download/311093/1543618621.svg" width="100px">
</a>
<a href="http://tmp.link/f/5c5abf115e51f">
  <img src="https://openclipart.org/download/311093/1543618621.svg" width="100px">
</a>
<a href="http://tmp.link/f/5c5ace0d0e0d7">
  <img src="https://openclipart.org/download/311093/1543618621.svg" width="100px">
</a>

### 安装

`win`和`Mac`安装简单,若你使用的是`linux`,我假设你下载了`AppImage`包

```bash
  # 给予权限
  chmod u+x moemusic.appimage
  # 打开
  ./moemusic.appimage
```

### build

`electorn`啥都好,就是太大了,你可以自行编译,我假设你有: `简单命令行` + `nodejs` + `git` 基础

```bash
  # clone到本地
  git clone https://github.com/d1y/moemusic
  # 安装依赖(推荐使用 yarn & cnpm)
  cd moemusic && yarn
  # api
  yarn run api
  # 打包所有支持的操作系统
  yarn run dist-all
  # win
  yarn run dist-win
  # mac
  yarn run dist-mac
  # linux
  yarn run dist-linux
```

> 我在`build`的过程中遇到了下载不了`release`,若你和我一样,都遇到了这个问题的话,我建议你使用`coding studio`的在线环境,然后编译,在国内的下载速度感觉海星✅

**PS:我强烈建议大家在安装`electorn`的前提下,然后直接使用我的源码.**

```bash
  # 安装electorn
  yarn global add electron
  cnpm i -g electron
  npm i -g electorn # 不建议
  # 添加alias
  echo "alias mm='electorn path'" >> ~/.zshrc # path = clone好的目录
  # 使用
  mm
```

## 使用

到了这步,说明小伙伴们都已经下载和安装好了`mm`

### 快捷键

`mm`拥有类`vim`的快捷键

| 键                     | 功能       |
|:--------------------- |:-------- |
| `ctrl+m` & `⌘+m`      | 菜单       |
| `ctrl+a` & `⌘+a`      | 播放列表     |
| `ctrl+p` & `⌘+p`      | 播放条      |
| `ctrl+f`              | 搜索       |
| `空格`                  | 播放 & 暂停  |
| `ctrl+1` & `←`        | 上一首      |
| `ctrl+2` & `→`        | 下一首      |
| `ctrl+3` &`↑`         | 音量+      |
| `ctrl+4` &`↓`         | 音量-      |
| `ctrl+tab`            | 音乐模式切换   |
| `1`                   | 音乐-5s    |
| `2`                   | 音乐+5s    |
| `esc`                 | 退出所有二级菜单 |
| `w o y a o m e i z i` | 彩蛋       |

值得一提的是,`mm`虽然想成为你的`girlfriend`,但她也不会过分的滥用全局快捷键,所以以上所有的快捷键只有在窗口获取到焦点的时候才生效👩🏻‍💼

### 功能

我知道你还是跃跃欲试
`mm`目前支持

#### 白噪音

`woootf`,这是必须的啊,`mm`当然不会对你`嘤嘤嘤`(她很高冷的好不好!)

创意和思路来自同款`mac`平台下的[`noizio`](http://noiz.io/),如果用过的小伙伴就不用我多说的吧

> Noizio功能很简单，但声音类型并不少。虽然这些声音都没有中文翻译，但是这些单词都还算简单，也有相应的图标方便识别，其实每一种都听一遍也不会浪费多少时间，总之很容易就能理解这些都是什么环境下的声音。
> 你可以只打开某一种声音，也可以通过组合不同的声音来模拟不同的环境，比如打开夏夜 + 海浪 + 火堆，就可以模拟坐在海滩边欣赏夜空的情景，经常用来午休时听，睡眠质量提升很明显。当然你也可以打开咖啡厅+太空深处这种奇葩的组合，想象自己坐在一个太空咖啡厅中，一边看星星一边品尝咖啡

现在知道了吧,`mm`它只想给你一个安静的私人空间👄,
**它在全局菜单的: `noizio`上**

## 作者有话说

<p align="center">
  <img src="https://i.loli.net/2019/01/15/5c3dd5904907a.png">
</p>

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
