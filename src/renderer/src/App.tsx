import Player from './components/Player'
import { useRef } from 'react'
import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import videoPlayer from 'video.js/dist/types/player'

function App(): JSX.Element {
  const playerRef = useRef<videoPlayer | null>(null)

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    controlBar: {
      volumePanel: { inline: false, volumeControl: { vertical: true } },
      children: [
        'playToggle',
        'volumePanel',
        'currentTimeDisplay',
        'progressControl',
        'durationDisplay',
        'pictureInPictureToggle',
        'fullscreenToggle'
      ]
    }
    // sources: [
    //   {
    //     src: ''
    //   }
    // ]
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting')
    })

    player.on('dispose', () => {
      videojs.log('player will dispose')
    })
  }

  function handleEnter(event) {
    // 检查按下的键是否是回车键
    if (event.keyCode === 13) {
      console.log(event.target.value)
      // 可以在这里添加其他的处理代码
      playerRef.current?.src([
        {
          src: event.target.value
        }
      ])
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    console.log(e)
    if (e.dataTransfer.files[0].path && e.dataTransfer.files[0].type) {
      playerRef.current?.src([{ src: e.dataTransfer.files[0].path }])
      e.target.value = e.dataTransfer.files[0].path
    }
  }

  return (
    <div className="bg-blue-800">
      <div className="my-3 text-center text-2xl text-cyan-200 font-mono">label Player</div>
      <Player options={videoJsOptions} onReady={handlePlayerReady} />
      <div>
        <input
          className="w-full h-16 mt-3 rounded-lg border-2 border-inherit border-double text-blue-600 font-mono text-lg font-semibold"
          type="text"
          draggable
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          onKeyDown={handleEnter}
          placeholder="输入路径或拖入文件后enter确认"
        />
      </div>
    </div>
  )
}

export default App
