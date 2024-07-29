import { app } from 'electron'
import path from 'path'
import fs from 'fs'

export const saveBase64Img = (data: string) => {
  try {
    const res = data.replace(/^data:image\/jpeg;base64,/, '')
    const buffer = Buffer.from(res, 'base64')

    const temp = path.join(app.getPath('userData'), 'poster')
    if (!fs.existsSync(temp)) {
      fs.mkdirSync(temp, {
        recursive: true
      })
    }

    const absPath = path.join(temp, `/${+new Date()}.jpg`)
    fs.writeFileSync(absPath, buffer)

    return absPath
  } catch {
    return ''
  }
}
