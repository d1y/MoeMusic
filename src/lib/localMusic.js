const MUSIC = new Audio()

let play = ()=> MUSIC.play(),
    pause = ()=> MUSIC.pause(),
    src = e=> MUSIC.src = e,
    loop = ()=> MUSIC.setAttribute('loop','loop'),
    loopClear = ()=> MUSIC.removeAttribute('loop'),
    VReduce = ()=> MUSIC.volume = MUSIC.volume <= 0.1 ? MUSIC.volume :  MUSIC.volume - 0.1,
    VPlus = ()=> MUSIC.volume = MUSIC.volume >= 0.9 ? MUSIC.volume : MUSIC.volume - 0.1,
    currentTime = ()=> MUSIC.currentTime,
    setTime =  time=> MUSIC.currentTime = time,
    currentSrc = ()=> MUSIC.currentSrc,
    duration = ()=> MUSIC.duration,
    ended	= ()=> MUSIC.ended,
    paused = ()=> MUSIC.paused

module.exports = {
  play,
  pause,
  src,
  loop,
  loopClear,
  VReduce,
  VPlus,
  currentSrc,
  currentTime,
  setTime,
  duration,
  ended,
  paused
}