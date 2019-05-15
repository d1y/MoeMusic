const MUSIC = new Audio()

document.body
  .appendChild(MUSIC)

let play = ()=> MUSIC.play(),
    pause = ()=> MUSIC.pause(),
    src = e=> MUSIC.src = e,
    loop = ()=> MUSIC.getAttribute('loop') ? MUSIC.removeAttribute('loop') : MUSIC.setAttribute('loop','loop'),
    VReduce = ()=> {
      if (MUSIC.volume*100 <= 10) {
        MUSIC.volume = .1
        return
      }
      MUSIC.volume -= .1
    },
    VPlus = ()=> {
      if (MUSIC.volume*100 >= 90) {
        MUSIC.volume = .9
        return
      }
      MUSIC.volume += .1
    },
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
  VReduce,
  VPlus,
  currentSrc,
  currentTime,
  setTime,
  duration,
  ended,
  paused
}