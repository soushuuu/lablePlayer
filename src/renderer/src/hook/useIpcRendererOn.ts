// import type { IpcRenderer } from '@electron-toolkit/preload'
import type { IpcRendererEvent } from 'electron'
import { IpcEvent } from 'src/common/ipcEvent'

type IpcRendererListener = (event: IpcRendererEvent, ...args: any[]) => void

export default function useIpcRendererOn(channel: IpcEvent, listener: IpcRendererListener) {
  //   const ipc = window.electron.ipcRenderer

  window.electron.ipcRenderer.on(channel, listener)
}
