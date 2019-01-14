(function () {
  const {BrowserWindow,shell} = require('electron').remote
  const path = require('path')
  ctrlInit = (c,m,b)=> {
      // Minimize task
      document.getElementById(m).addEventListener("click", (e) => {
          console.log(BrowserWindow);
          var mainWindow = BrowserWindow.getFocusedWindow();
          mainWindow.minimize();
      });
      // Maximize window
      document.getElementById(b).addEventListener("click", (e) => {
          var mainWindow = BrowserWindow.getFocusedWindow();
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
  };
})();
