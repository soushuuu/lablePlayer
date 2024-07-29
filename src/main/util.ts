import { existsSync, statSync } from 'fs'
import { basename, extname } from 'path'

export const getVideoExtension = (withDot = true) => {
  return withDot ? ['.mp4', '.webm', '.ogg'] : ['mp4', 'webm', 'ogg']
}

export const getVideoFromPath = (path: string) => {
  if (path && existsSync(path)) {
    const stat = statSync(path)
    if (stat.isFile()) {
      const name = basename(path)
      const ext = extname(name)
      const extension = getVideoExtension()
      if (extension.indexOf(ext.toLowerCase()) >= 0) {
        return {
          path: path,
          name: name
        }
      }
    }
  }

  return
}
