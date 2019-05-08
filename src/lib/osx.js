const {ipcRenderer: ipc} = require('electron');

document.getElementById('osx-close')
  .addEventListener('click',()=>ipc.send('osx-close'))
document.getElementById('osx-min')
  .addEventListener('click',()=>ipc.send('osx-min'))
document.getElementById('osx-max')
  .addEventListener('click',()=>ipc.send('osx-max'))