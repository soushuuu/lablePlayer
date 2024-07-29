import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import videoPlayer from 'video.js/dist/types/player'
import 'video.js/dist/video-js.css'
import '../assets/downloadButton.css'

export const Player = (props) => {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<videoPlayer | null>(null)
  const { options, onReady } = props

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js')

      // videoElement.classList.add('vjs-big-play-centered')
      // videoElement.classList.add('vjs-4-3')
      videoElement.classList.add('vjs-16-9')
      videoRef.current?.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready')
        setDownloadButton(player)
        onReady && onReady(player)
      }))

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current

      player.autoplay(options.autoplay)
      player.src(options.sources)
    }
  }, [options, videoRef])

  const setDownloadButton = (player: videoPlayer) => {
    player.addClass('vjs-download')
    const Button = videojs.getComponent('Button')
    const myButton = new Button(player, {
      className: 'vjs-download'
    })
    myButton.on('click', () => {
      // m3u8: application/x-mpegURL
      // mp4: video/mp4

      const src = player.getMedia().src[0].src
      const type = player.getMedia().src[0].type
      if (src && type) {
        switch (type) {
          case 'application/x-mpegURL':
            // TODO: download m3u8

            break
          case 'video/mp4':
            // TODO: download mp4
            console.log('mp4 type: ', type)
            break
          default:
            console.log('unknown type: ', type)
            break
        }
      }
    })
    player.getChild('controlBar')?.addChild(myButton)
  }

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div className="w-full">
      <div data-vjs-player>
        <div ref={videoRef} />
      </div>
    </div>
  )
}

export default Player
