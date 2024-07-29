import { BrowserWindow, dialog, ipcMain } from 'electron'
import { IpcEvent } from '../common/ipcEvent'
import { getVideoExtension, getVideoFromPath } from './util'
import { VideoFile, VideoInfo } from '../common/type'
import { store } from './store'
import { saveBase64Img } from './fs'
import { setWindowJumpList } from './history'

const register = (): void => {
  ipcMain.on(IpcEvent.EV_SHOW_OPEN_DIALOG, async (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)!
    win!.focus()

    dialog
      .showOpenDialog(win, {
        title: '选择文件',
        properties: ['openFile', 'multiSelections'],
        filters: [
          {
            extensions: getVideoExtension(false),
            name: 'Vieo'
          }
        ]
      })
      .then((res) => {
        if (!res.canceled) {
          const videoFile: VideoFile[] = []
          res.filePaths.forEach((path) => {
            const file = getVideoFromPath(path)
            if (file) {
              videoFile.push(file)
            }
          })
          e.sender.send(IpcEvent.EV_PLAY, videoFile)
        }
      })
  })

  ipcMain.on(IpcEvent.EV_ADD_VIDEOS, (e, video: VideoInfo[]) => {
    const path = video.map((v) => v.path)
    let list = store.get('playList')
    list = list.filter((v) => !path.includes(v.path))
    list = video.concat(list)

    video.forEach((v) => {
      const savePath = saveBase64Img(v.poster)
      v.poster = savePath
    })

    if (list.length > 10) {
      list = list.slice(0, 10)
    }
    store.set('playList', list)

    setWindowJumpList(list)

    e.reply(IpcEvent.EV_ADD_VIDEOS, list)
  })

  ipcMain.handle(IpcEvent.EV_GET_PLAYLIST, () => {
    return store.get('playList')
  })
}

export default { register }
