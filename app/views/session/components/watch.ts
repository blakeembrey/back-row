import React = require('react')
import { create } from 'react-free-style'
import { createContainer } from 'marty'
import Spinner from '../../../components/spinner'
import Video from '../../../components/video'
import { Torrent } from '../../../stores/torrent'
import { Movie } from '../../../stores/movie'
import { Session } from '../../../stores/session'
import { BASE_URL } from '../../../utils/config'
import Application from '../../../app'

const Style = create()

const CONTAINER_STYLE = Style.registerStyle({
  flex: 1,
  WebkitFlex: 1
})

const VIDEO_STYLE = Style.registerStyle({
  padding: '14px'
})

const STATUS_STYLE = Style.registerStyle({
  fontSize: 10,
  textAlign: 'center',
  padding: '0 14px 14px'
})

interface WatchProps {
  app: Application
  onChange: (status: string, time: number) => any
  session: Session
  torrents: {
    [quality: string]: Torrent
  }
  movie: Movie
}

class WatchView extends React.Component<WatchProps, {}> {

  render () {
    const { torrents, movie, onChange, session } = this.props
    const { options, state } = session
    const { time, play, ready, waiting } = state
    const torrent = torrents[options.quality]
    const peerCount = state.peers.length

    let statusText = `Watching "${movie.title}"`

    if (peerCount) {
      statusText += ` with ${peerCount} ${peerCount === 1 ? 'peer' : 'peers'}`
    }

    if (ready === 'waiting') {
      statusText += ` (buffering)`
    } else if (waiting) {
      statusText += ` (${waiting} buffering)`
    }

    return React.createElement(
      'div',
      { className: CONTAINER_STYLE.className },
      React.createElement(
        Video,
        {
          src: BASE_URL + '/torrent/stream?uri=' + encodeURIComponent(btoa(torrent.url)),
          poster: movie.backgroundImage,
          onChange: onChange,
          className: VIDEO_STYLE.className,
          time,
          play
        }
      ),
      React.createElement(
        'div',
        { className: STATUS_STYLE.className },
        statusText
      )
    )
  }

}

export default createContainer(Style.component(WatchView), {
  listenTo: ['movieStore', 'torrentStore'],
  fetch: {
    movie () {
      return this.app.movieStore.getMovie(this.props.session.options.imdbId)
    },
    torrents () {
      return this.app.torrentStore.getMovie(this.props.session.options.imdbId)
    }
  },
  pending () {
    return React.createElement(Spinner)
  }
})
