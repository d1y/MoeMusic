const {app,BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
let win
createWindow = ()=> {
  win = new BrowserWindow({
    width: 900,
    height: 600,
    alwaysOnTop: false,
    frame: false,
    transparent: true,
    resizable: false,
    icon: "app/ass/moe.png"
  })
  win.loadURL(url.format({
    protocol: 'http:',
    host: 'localhost:3000',
    path: '/'
  }))
  win.loadURL(url.format({
    pathname: path.join(__dirname,'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (win === null) {
    createWindow()
  }
})
