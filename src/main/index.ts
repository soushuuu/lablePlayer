import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { IpcEvent } from '../common/ipcEvent'
import { getVideoFromPath } from './util'
import { argv } from 'process'
import ipc from './ipc'

let mainWindow: BrowserWindow | null

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 640,
    minHeight: 420,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      webSecurity: false,
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('dom-ready', () => {
    playVideo()
  })

  mainWindow.on('minimize', () => {
    sendIpc(IpcEvent.EV_PAUSE)
  })

  mainWindow.on('maximize', () => {
    sendIpc(IpcEvent.WIN_MAX_REPLY, true)
  })

  mainWindow.on('unmaximize', () => {
    sendIpc(IpcEvent.WIN_MAX_REPLY, false)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const sendIpc = (channel: IpcEvent, ...args: any[]) => {
  mainWindow?.webContents.send(channel, args)
}

const initApp = () => {
  const appInstance = app.requestSingleInstanceLock()

  if (!appInstance) {
    app.quit()
  } else {
    app.on('second-instance', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
        playVideo(argv)
      }
    })
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('label-player')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // IPC test
    // ipcMain.on('ping', () => console.log('pong'))

    optimizer.registerFramelessWindowIpc()

    ipc.register()

    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // In this file you can include the rest of your app"s specific main process
  // code. You can also put them in separate files and require them here.
}

const getPath = (argv?: string[]) => {
  const args = argv || process.argv
  const uri = args.find((arg) => arg.startsWith('--uri='))

  if (uri) {
    return uri.substring(6)
  }
  return args.pop() || ''
}

const playVideo = (args?: string[]) => {
  const path = getPath(args)

  if (path) {
    const video = getVideoFromPath(path)
    if (video) {
      sendIpc(IpcEvent.EV_PLAY, [video])
    }
  }
}

initApp()
