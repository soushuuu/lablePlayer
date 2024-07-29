import { VideoFile, VideoInfo } from 'src/common/type'

/**
 * Get video infomation
 */
const getVideoInfo = (name: string, src: string): Promise<VideoInfo | null> => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.setAttribute('src', `file:///${src}`)
    video.onloadedmetadata = (): void => {
      video.currentTime = 1
    }
    video.onseeked = (): void => {
      const { duration, videoHeight, videoWidth } = video
      let w = videoWidth
      let h = videoHeight
      if (w > h) {
        if (w > 640) {
          const scale = 640 / videoWidth
          w = 640
          h = Math.ceil(h * scale)
        }
      } else {
        const scale = 480 / videoHeight
        h = 480
        w = Math.ceil(w * scale)
      }
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = w
      canvas.height = h
      ctx?.drawImage(video, 0, 0, w, h)
      const dataUrl = ctx?.canvas.toDataURL('image/jpeg', 0.9) || ''

      const min = Math.floor(duration / 60)
      const sec = Math.floor(duration % 60)

      resolve({
        path: src,
        name,
        duration: (min >= 10 ? min : `0${min}`) + ':' + (sec >= 10 ? sec : `0${sec}`),
        current: 0,
        poster: dataUrl
      })
    }
    video.onerror = (): void => {
      resolve(null)
    }
  })
}

export const getVideoInfoList = async (videoFiles: VideoFile[]): Promise<VideoInfo[]> => {
  const ps: Promise<VideoInfo | null>[] = []
  videoFiles.forEach((f) => {
    ps.push(getVideoInfo(f.name, f.path))
  })

  const videoInfoList: VideoInfo[] = []
  await Promise.all(ps).then((results) => {
    results.forEach((videoInfo) => {
      if (videoInfo) videoInfoList.push(videoInfo)
    })
  })

  return videoInfoList
}

/**
 * 
 * // 视频格式
    type："video/webm"   // 可以播放，用ogg也可打开
    type："video/ogg"    // 可以播放，用webm也可打开
    type："video/3gp"    // 可以播放
    type："video/mp4"    // 可以播放
    type："video/avi"    // 打不开 无法播放
    type："video/flv"    // 打不开 可以使用flvjs代替
    type："video/mkv"    // 打不开 使用video/mp4可以播放 没声音
    type："video/mov"    // 打不开 使用video/mp4可以播放
    type："video/mpg"    // 打不开 未测试
    type："video/swf"    // 打不开  未测试
    type："video/ts"     // 打不开 未测试
    type："video/wmv"    // 打不开 未测试
    type："video/vob"    // 没转化 未测试
    type："video/mxf"    // 转化出错 未测试
    type: "video/rm"     // 转化出错 未测试

    // 组件方法
    重置进度条
    this.player.src(src)
    加载视频
    this.player.load();
    播放视频
    this.player.play();
    暂停播放
    this.player.pause();
    直接全屏 如果当前设备支持的话
    this.player.requestFullscreen();
    在全屏模式下，将视频恢复到正常大小
    this.player.exitFullscreen();
    当环境不支持全屏时 则扩展铺满容器
    this.player.enterFullWindow();
    重置播放器
    this.player.reset();
    返回当前播放源信息
    this.player.currentSources();
    获取或者设置预加载属性
    this.player.preload(val);
    播放控件是否显示
    this.player.controls(false);
 * 
 */
