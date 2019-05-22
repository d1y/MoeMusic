const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu
} = require('electron')

const path = require('path')

let win

const window = {
  width: 900,
  height: 600,
  alwaysOnTop: false,
  frame: false,
  transparent: true,
  // resizable: false,
  // maximizable: false,
  center: true,
  skipTaskbar: true,
  icon: './src/static/logos/moe.png'
}

let appTray

const createWindow = () => {

  win = new BrowserWindow(window)

  let devURL = `http://localhost:3000`

  // 开发环境
  // win.loadURL(`${devURL}/src/pages/index.html`)

  // 上线环境
  win.loadFile(`${__dirname}/src/pages/index.html`)

  // 开发者模式
  win.webContents.openDevTools()

  let trayMenuTemplate = [{
      label: '设置',
      click: function () {} //打开相应页面
    },
    {
      label: '帮助',
      click: function () {}
    },
    {
      label: '关于',
      click: function () {}
    },
    {
      label: '退出',
      click: function () {
        app.quit();
        app.quit(); //因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
      }
    }
  ];
  let py = `src/static/assets/login.png`
  let test = `sunTemplate.png`
  console.log(py)
  appTray = new Tray(path.join(__dirname,test)); //app.ico是app目录下的ico文件
  console.log('创建图标')
  //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  //设置此托盘图标的悬停提示内容
  appTray.setToolTip('我的托盘图标');

  //设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu);
  //单击右下角小图标显示应用
  appTray.on('click', function () {
    console.log('eyes')
    win.show();
  })
  console.log(appTray)
  ipcMain.on('osx-close', () => win.close())

  ipcMain.on('osx-min', () => win.minimize())

  ipcMain.on('osx-max', () => {
    if (process.platform == 'win32') return
    win.isMaximized() ? win.unmaximize() : win.maximize();
  })

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