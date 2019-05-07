const { app,BrowserWindow } = require('electron')
const url = require('url')

let win

const window = {
  width: 900,
  height: 600,
  alwaysOnTop: false,
  frame: false,
  transparent: true,
  resizable: false,
  maximizable: false,
  center: true,
  skipTaskbar: true,
  icon: './src/static/logos/moe.png'
}

const createWindow = () => {

  win = new BrowserWindow(window)

  let devURL = `http://localhost:3000`

  // 开发环境
  win.loadURL(`${devURL}/src/pages/index.html`)

  // 上线环境
  
  // 开发者模式
  win.webContents.openDevTools()

  // user-agent
  win.webContents.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8');

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
