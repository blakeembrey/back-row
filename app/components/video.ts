import React = require('react')
import { create } from 'react-free-style'
import videojs = require('video.js')

const Style = create()

const VIDEO_WRAPPER_STYLE = Style.registerStyle({
  flex: 1,
  WebkitFlex: 1,
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
  className?: string
}

class Video extends React.Component<VideoProps, {}> {

  player: any
  readyState: string
  time = 0
  playState = false

  emitChange (playState: boolean, readyState: string) {
    const time = Math.max(0, this.player.currentTime() * 1000)
    const changedTime = time !== this.time
    const changedPlayState = playState !== this.playState
    const changedReadyState = readyState !== this.readyState

    // Set the states before we trigger `onChange` to avoid looping.
    this.time = time
    this.playState = playState
    this.readyState = readyState

    if (changedPlayState || changedReadyState || changedTime) {
      this.props.onChange(playState, readyState, time)
    }
  }

  setTime (time: number) {
    if (time != null) {
      const seconds = time / 1000
      const currentTime = this.player.currentTime()

      this.time = time

      // TODO: Figure this out better.
      if (seconds !== currentTime) {
        this.player.currentTime(seconds)
      }
    }
  }

  setPlayState (playState: boolean) {
    if (this.playState === playState) {
      return
    }

    this.playState = playState

    if (playState) {
      this.player.play()
    } else {
      this.player.pause()
    }
  }

  setPlayerState (props: VideoProps) {
    this.setTime(props.time)
    this.setPlayState(props.play)
  }

  componentDidUpdate () {
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
      this.emitChange(true, this.readyState)
    })

    player.on('pause', () => {
      this.emitChange(false, this.readyState)
    })

    player.on('seeking', () => {
      this.emitChange(this.playState, this.readyState)
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
    return React.createElement('div', {
      ref: 'target',
      className: Style.join(this.props.className, VIDEO_WRAPPER_STYLE.className)
    })
  }

}

export default Style.component(Video)
