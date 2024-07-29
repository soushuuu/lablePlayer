import { JumpListCategory, JumpListItem, app } from 'electron'
import { VideoInfo } from '../common/type'
import { platform } from '@electron-toolkit/utils'
import { store } from './store'

export const setWindowJumpList = (videoList?: VideoInfo[]) => {
  if (!platform.isWindows) {
    return
  }

  const jumpList: JumpListCategory[] = []

  let video = videoList || store.get('playList')

  const jumpItemList: JumpListItem[] = []

  if (video.length > 0) {
    video = video.slice(0, 5)
    video.forEach((item) => {
      jumpItemList.push({
        type: 'task',
        title: item.name.substring(0, 255),
        description: item.path.substring(0, 255),
        program: process.execPath,
        args: `--uri=${item.path}`,
        iconPath: process.execPath,
        iconIndex: 0
      })
    })
  }

  if (jumpItemList.length) {
    jumpList.push({
      type: 'custom',
      name: '最近播放',
      items: jumpItemList
    })
  }

  if (jumpList.length) {
    app.setJumpList(jumpList)
  }
}

export const clearWindowJumpList = () => {
  if (!platform.isWindows) {
    return
  }

  app.setJumpList([])
}
