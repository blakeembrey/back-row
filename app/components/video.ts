import React = require('react')
import { create } from 'react-free-style'
import videojs = require('video.js')

const Style = create()

const VIDEO_WRAPPER_STYLE = Style.registerStyle({
  flex: 1,
  WebkitFlex: 1,
  padding: '2em',
  justifyContent: 'center',
  alignItems: 'center',

  '.video-js': {
    flex: 1,
    WebkitFlex: 1
  },

  '.vjs-poster': {
    backgroundSize: 'cover'
  }
})

interface VideoProps {
  poster?: string
  src: string
  onChange: (play: boolean, ready: string, time: number) => any
  time?: number
  play?: boolean
}

class Video extends React.Component<VideoProps, {}> {

  player: any
  playState = true
  readyState = 'ready'
  toggledPlayState = false

  emitChange (playState: boolean, readyState: string) {
    if (playState !== this.playState || readyState !== this.readyState) {
      this.props.onChange(playState, readyState, this.player.currentTime() * 1000)
    }

    this.playState = playState
    this.readyState = readyState
  }

  setTime (time: number) {
    if (time != null) {
      const seconds = time / 1000
      const currentTime = this.player.currentTime()

      if (~~seconds !== ~~currentTime) {
        this.player.currentTime(seconds)
      }
    }
  }

  setPlayState (playState: boolean) {
    if (playState) {
      this.player.play()
    } else {
      this.player.pause()
    }

    this.playState = playState
  }

  setPlayerState (props: VideoProps) {
    this.setTime(props.time)
    this.setPlayState(props.play)
  }

  componentDidUpdate (props: VideoProps) {
    this.setPlayerState(this.props)
  }

  componentDidMount () {
    const target = (<any> this.refs).target.getDOMNode()
    const videoElement = document.createElement('video')
    const { src, poster } = this.props

    target.appendChild(videoElement)
    videoElement.src = src
    videoElement.className = 'video-js vjs-default-skin vjs-big-play-centered'

    const player = this.player = videojs(videoElement, {
      controls: true,
      preload: 'auto',
      poster: poster,
      width: '100%',
      height: '100%'
    })

    player.on('play', () => {
      this.emitChange(true, 'toggle')
    })

    player.on('pause', () => {
      this.emitChange(false, 'toggle')
    })

    player.on('seeking', () => {
      this.emitChange(this.playState, 'seeking')
    })

    player.on('canplaythrough', () => {
      this.emitChange(this.playState, 'ready')
    })

    player.on('waiting', () => {
      this.emitChange(this.playState, 'waiting')
    })

    player.on('ended', () => {
      this.emitChange(this.playState, 'ended')
    })

    this.setPlayerState(this.props)
  }

  render () {
    return React.createElement('div', { ref: 'target', className: VIDEO_WRAPPER_STYLE.className })
  }

}

export default Style.component(Video)
