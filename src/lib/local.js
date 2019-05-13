const local = window.localStorage

let db = JSON.parse(local.getItem('songs')) || []

let set = (key,any) => {
  if (any) {
    local.setItem(key,JSON.stringify(any))
  }else {
    local.setItem('songs',JSON.stringify(any))
  }
  
}

let get = key => local.getItem(key)


module.exports = {
  db,
  set,
  get
}