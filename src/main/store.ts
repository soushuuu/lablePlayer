import { VideoInfo } from '../common/type'
import Store, { Schema } from 'electron-store'

interface Entity {
  playList: VideoInfo[]
}

const schema: Schema<Entity> = {
  playList: {
    type: 'array',
    default: []
  }
}

export const store = new Store<Entity>({ schema })
