import React = require('react')
import { create } from 'react-free-style'
import { createContainer } from 'marty'
import Spinner from '../../components/spinner'
import { Movie } from '../../stores/movie'
import { Torrent } from '../../stores/torrent'
import MoviePoster from './components/poster'
import MovieDetails from './components/details'
import { otherwise } from '../../utils/common'

var Style = create()

var CONTAINER_STYLE = Style.registerStyle({
  flex: 1,
  WebkitFlex: 1,
  backgroundColor: '#000',
  justifyContent: 'center'
})

var BACKGROUND_STYLE = Style.registerStyle({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  opacity: 0.3,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})

var MOVIE_PAGE_STYLE = Style.registerStyle({
  flex: '0 1 auto',
  WebkitFlex: '0 1 auto',
  flexDirection: 'column',
  WebkitFlexDirection: 'column',
  alignSelf: 'center',
  WebkitAlignSelf: 'center',

  '@media (min-width: 680px)': {
    maxWidth: 980,
    flexDirection: 'row',
    WebkitFlexDirection: 'row'
  }
})

var MOVIE_POSTER_STYLE = Style.registerStyle({
  padding: '1em',
  maxHeight: 280,
  height: 'calc(100vh - 34px)',

  '@media (min-width: 680px)': {
    maxHeight: 500
  }
})

var MOVIE_DETAILS_STYLE = Style.registerStyle({
  flex: '0 1 auto',
  WebkitFlex: '0 1 auto',
  padding: '1em'
})

interface MovieProps {
  movie: Movie
  torrents: {
    [quality: string]: Torrent
  }
}

interface MovieState {
  quality?: string
  qualities?: string[]
}

const TORRENT_ORDER: { [quality: string]: number } = {
  '480p': 0,
  '720p': 1,
  '1080p': 2,
  '3D': 3
}

class MovieView extends React.Component<MovieProps, MovieState> {

  componentWillMount () {
    const qualities = Object.keys(this.props.torrents)
      .sort((a: string, b: string) => {
        return otherwise(TORRENT_ORDER[a], Infinity) - otherwise(TORRENT_ORDER[b], Infinity)
      })

    this.setState({ qualities, quality: qualities[0] })
  }

  render () {
    var { movie, torrents } = this.props

    return React.createElement(
      'div',
      {
        className: CONTAINER_STYLE.className
      },
      React.createElement(
        'div',
        {
          className: BACKGROUND_STYLE.className,
          style: {
            backgroundImage: Style.url(movie.backgroundImage)
          }
        }
      ),
      React.createElement(
        'div',
        {
          className: MOVIE_PAGE_STYLE.className
        },
        React.createElement(
          MoviePoster,
          {
            src: movie.posterImage,
            className: MOVIE_POSTER_STYLE.className
          }
        ),
        React.createElement(
          MovieDetails,
          {
            movie: movie,
            torrent: torrents[this.state.quality],
            qualities: this.state.qualities,
            selectQuality: (quality: string) => this.setState({ quality }),
            className: MOVIE_DETAILS_STYLE.className
          }
        )
      )
    )
  }

}

export default createContainer(Style.component(MovieView), {
  listenTo: ['movieStore', 'torrentStore'],
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },
  fetch: {
    movie () {
      var { imdbId } = this.context.router.getCurrentParams()

      return this.app.movieStore.getMovie(imdbId)
    },
    torrents () {
      var { imdbId } = this.context.router.getCurrentParams()

      return this.app.torrentStore.getMovie(imdbId)
    }
  },
  pending () {
    return React.createElement(Spinner)
  }
})
