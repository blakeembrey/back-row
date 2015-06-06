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

/**
 * Check if a value is within the target threshold.
 */
function within (value: number, lower: number, upper: number) {
  return value > lower && value < upper
}

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

class Video extends React.Component<VideoProps, VideoState> {

  player: any

  state: VideoState = {
    time: 0,
    play: false,
    ready: undefined
  }

  setTime (time: number) {
    const currentTime = this.getTime()
    const { threshold } = this.props

    if (!within(currentTime, time - threshold, time + threshold * 2)) {
      this.player.currentTime(time / 1000)
    }
  }

  getTime () {
    return this.player.currentTime() * 1000
  }

  setPlayState (playState: boolean) {
    if (playState) {
      this.player.play()
    } else {
      this.player.pause()
    }
  }

  setPlayerState (state: VideoState) {
    this.setTime(state.time)
    this.setPlayState(state.play)
  }

  componentWillReceiveProps (props: VideoProps) {
    this.setState({ time: props.time, play: props.play })
  }

  shouldComponentUpdate (nextProps: VideoProps, nextState: VideoState) {
    return this.state.time !== nextState.time ||
      this.state.ready !== nextState.ready ||
      this.state.play !== nextState.play
  }

  componentWillUpdate (props: VideoProps, state: VideoState) {
    this.setPlayerState(state)
  }

  componentDidUpdate () {
    this.props.onChange(this.state)
  }

  componentWillMount () {
    this.setState({ time: this.props.time, play: this.props.play })
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
      this.setState({ play: !player.paused(), time: this.getTime() })
    })

    player.on('pause', () => {
      this.setState({ play: !player.paused(), time: this.getTime() })
    })

    player.on('seeking', () => {
      this.setState({ time: this.getTime() })
    })

    player.on('canplaythrough', () => {
      this.setState({ ready: 'ready', time: this.getTime() })
    })

    player.on('waiting', () => {
      this.setState({ ready: 'waiting', time: this.getTime() })
    })

    this.setPlayerState(this.state)
  }

  render () {
    return React.createElement('div', {
      ref: 'target',
      className: Style.join(this.props.className, VIDEO_WRAPPER_STYLE.className)
    })
  }

}

export default Style.component(Video)
