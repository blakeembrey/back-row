import React = require('react')
import { create } from 'react-free-style'
import { createContainer } from 'marty'
import Spinner from '../../../components/spinner'
import Video from '../../../components/video'
import { Torrent } from '../../../stores/torrent'
import { Movie } from '../../../stores/movie'
import { BASE_URL } from '../../../utils/config'
import Application from '../../../app'

const Style = create()

interface WatchProps {
  app: Application
  onChange: (status: string, time: number) => any
  imdbId: string
  quality: string
  torrents: {
    [quality: string]: Torrent
  }
  movie: Movie
  time: number
  play: boolean
}

class WatchView extends React.Component<WatchProps, {}> {

  render () {
    const { quality, torrents, movie, onChange, time, play } = this.props
    const torrent = torrents[quality]

    return React.createElement(
      Video,
      {
        src: BASE_URL + '/torrent/stream?uri=' + encodeURIComponent(btoa(torrent.url)),
        poster: movie.backgroundImage,
        onChange: onChange,
        time,
        play
      }
    )
  }

}

export default createContainer(Style.component(WatchView), {
  listenTo: ['movieStore', 'torrentStore'],
  fetch: {
    movie () {
      return this.app.movieStore.getMovie(this.props.imdbId)
    },
    torrents () {
      return this.app.torrentStore.getMovie(this.props.imdbId)
    }
  },
  pending () {
    return React.createElement(Spinner)
  }
})
