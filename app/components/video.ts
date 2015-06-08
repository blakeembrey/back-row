import React = require('react')
import { create } from 'react-free-style'
import videojs = require('video.js')

const Style = create()

const TIME_ACCURACY = 10

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
  onChange: (state: VideoState) => any
  time?: number
  play?: boolean
  threshold?: number
  className?: string
}

interface VideoState {
  time?: number
  play?: boolean
  ready?: string
}

function videoTime (value: number) {
  return Math.round(value / TIME_ACCURACY) * TIME_ACCURACY
}

class Video extends React.Component<VideoProps, VideoState> {

  player: any

  state: VideoState = {
    time: 0,
    play: false,
    ready: undefined
  }

  getTime () {
    return videoTime(this.player.currentTime() * 1000)
  }

  hasStateChanged (newState: VideoState) {
    return this.getTime() !== newState.time ||
      this.state.ready !== newState.ready ||
      this.state.play !== newState.play
  }

  updatePlayerState (state: VideoState) {
    const currentTime = this.getTime()
    const { time, play } = state

    if (this.getTime() !== time) {
      this.player.currentTime(time / 1000)
    }

    if (play) {
      this.player.play()
    } else {
      this.player.pause()
    }
  }

  setAndEmitState (state: VideoState) {
    const currentState = this.state

    this.setState(state, () => {
      if (this.hasStateChanged(currentState)) {
        this.props.onChange(this.state)
      }
    })
  }

  componentWillReceiveProps (props: VideoProps) {
    this.setState({ time: videoTime(props.time), play: props.play })
  }

  shouldComponentUpdate (nextProps: VideoProps, nextState: VideoState) {
    return this.hasStateChanged(nextState)
  }

  componentWillUpdate (nextProps: VideoProps, nextState: VideoState) {
    this.updatePlayerState(nextState)
  }

  componentWillMount () {
    this.setState({ time: videoTime(this.props.time), play: this.props.play })
  }

  componentWillUnmount () {
    // Dispose of the video player when navigating away.
    this.player.dispose()
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
      // Use player state since "play" and "pause" emits erroneously.
      this.setAndEmitState({ play: !player.paused(), time: this.getTime() })
    })

    player.on('pause', () => {
      this.setAndEmitState({ play: !player.paused(), time: this.getTime() })
    })

    player.on('seeking', () => {
      this.setAndEmitState({ time: this.getTime() })
    })

    player.on('canplaythrough', () => {
      this.setAndEmitState({ ready: 'ready', time: this.getTime() })
    })

    player.on('waiting', () => {
      this.setAndEmitState({ ready: 'waiting', time: this.getTime() })
    })

    this.updatePlayerState(this.state)
  }

  render () {
    return React.createElement('div', {
      ref: 'target',
      className: Style.join(this.props.className, VIDEO_WRAPPER_STYLE.className)
    })
  }

}

export default Style.component(Video)
