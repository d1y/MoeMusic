# 网易云官方
网易云官方的接口有加密措施,暂时用的是别人现成的接口

## 官方
###  搜索

`**POST** http://music.163.com/api/search/get/`

####  参数

__s__: 搜索词

__limit__: 返回数量

__sub__: 意义不明(非必须参数)；取值：false

__type__: 搜索类型；取值意义

* __1__ 单曲
* __10__ 专辑
* __100__ 歌手
* __1000__ 歌单
* __1002__ 用户

__offset__: 偏移数量，用于分页

__MUSIC_U__: 意义不明(非必须参数)

### 获取歌手专辑列表

`GET http://music.163.com/api/artist/albums/[artist_id]/`

 其中`artist_id`用歌手id替换

#### 参数

__offset__: 偏移数量，用于分页

__limit__: 返回数量


### 获取专辑音乐列表

`GET http://music.163.com/api/album/[album_id]/`

 其中`album_id`用专辑id替换

### 获取歌词
> POST

- `http://music.163.com/api/song/media?id=`

- `https://music.163.com/api/song/lyric?{0}?os=pc&id=1293951677&lv=-1&kv=-1&tv=-1`

### FM
- `http://music.163.com/api/radio/get`

### 直链

- `http://music.163.com/song/media/outer/url?id=??.mp3`

### 歌单

- `https://music.163.com/api/playlist/detail?id=??`

### 歌词

- `http://music.163.com/api/v1/resource/comments/R_SO_4_??`

## 第三方
参考:
- https://binaryify.github.io/NeteaseCloudMusicApi/#/
- 目前在用: https://zhuanlan.zhihu.com/p/30246788
- 比较完善: https://www.bzqll.com/2018/10/39.html
