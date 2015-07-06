import React = require('react')
import { create } from 'react-free-style'
import videojs  from '../lib/videojs'

const TIME_ACCURACY = 50

const Style = create()

const VIDEO_WRAPPER_STYLE = Style.registerStyle({
  flex: 1,
  WebkitFlex: 1,
  justifyContent: 'center',
  alignItems: 'center',

  '.video-js': {
    flex: 1,
    WebkitFlex: 1,

    '&:focus': {
      outline: 0
    }
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

class Video extends React.Component<VideoProps, VideoState> {

  player: any

  state: VideoState = {
    time: 0,
    play: false,
    ready: undefined
  }

  getTime () {
    return Math.floor(this.player.currentTime() * 1000)
  }

  hasStateChanged (newState: VideoState) {
    const currentTime = this.getTime()

    return currentTime < newState.time - TIME_ACCURACY ||
      currentTime > newState.time + TIME_ACCURACY ||
      this.state.ready !== newState.ready ||
      this.state.play !== newState.play
  }

  updatePlayerState (state: VideoState) {
    const currentTime = this.getTime()
    const { time, play } = state

    if (currentTime !== time) {
      this.player.currentTime(time / 1000)
    }

    if (play) {
      this.player.play()
    } else {
      this.player.pause()
    }
  }

  setAndEmitState (state: VideoState) {
    const previousState = this.state

    // Emit only the changed state on toggle.
    this.setState(state, () => {
      if (this.hasStateChanged(previousState)) {
        this.props.onChange(this.state)
      }
    })
  }

  componentWillReceiveProps (props: VideoProps) {
    this.setState({ time: props.time, play: props.play })
  }

  shouldComponentUpdate (nextProps: VideoProps, nextState: VideoState) {
    return this.hasStateChanged(nextState)
  }

  componentWillUpdate (nextProps: VideoProps, nextState: VideoState) {
    this.updatePlayerState(nextState)
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
      height: '100%',
      plugins: {
        hotkeys: {}
      }
    })

    // Use player state since "play" and "pause" emits erroneously.
    const playStateChangeHandler = () => {
      this.setAndEmitState({ play: !player.paused(), time: this.getTime() })
    }

    player.on('play', playStateChangeHandler)
    player.on('pause', playStateChangeHandler)

    player.on('seeking', () => {
      this.setAndEmitState({ time: this.getTime() })
    })

    player.on('canplaythrough', () => {
      this.setAndEmitState({ ready: 'ready', time: this.getTime() })
    })

    player.on('waiting', () => {
      // Emit waiting only when needed.
      if (player.paused()) {
        this.setAndEmitState({ ready: 'waiting' })
      }
    })

    player.on('timeupdate', () => {
      this.setState({ time: this.getTime() })
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
