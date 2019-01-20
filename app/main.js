(function () {
  const {BrowserWindow,shell} = require('electron').remote
  ctrlInit = (c,m,b)=> {
      // Minimize task
      document.getElementById(m).addEventListener("click", (e) => {
          var mainWindow = BrowserWindow.getFocusedWindow();
          mainWindow.minimize();
      });
      // Maximize window
      document.getElementById(b).addEventListener("click", (e) => {
          return
          var mainWindow = BrowserWindow.getFocusedWindow();
          if(process.platform == 'win32') return
          if(mainWindow.isMaximized()){
              mainWindow.unmaximize();
          }else{
              mainWindow.maximize();
          }
      });
      // Close app
      document.getElementById(c).addEventListener("click", (e) => {
          var mainWindow = BrowserWindow.getFocusedWindow();
          mainWindow.close();
      });
  };
  document.onreadystatechange =  () => {
      if (document.readyState == "complete") {
          ctrlInit('window-closed','window-min','window-max')
      }
      window.onkeydown =  (e) => {
        let code = e.key
        if ( (code == 'r' || code == 'R') && (e.metaKey || e.ctrlKey) ){
          return false
        }
      }
      document.getElementById('download-file').onclick = ()=>{
        shell.openExternal(document.getElementById('music').getAttribute('src'))
      }
};
})();
