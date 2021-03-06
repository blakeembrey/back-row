import { Application } from 'marty'

import MovieStore from './stores/movie'
import MoviesStore from './stores/movies'
import TorrentStore from './stores/torrent'
import SessionStore from './stores/session'

import MovieQueries from './queries/movie'
import MoviesQueries from './queries/movies'
import TorrentQueries from './queries/torrent'

import PageActionCreators from './actions/page'
import SessionActionCreators from './actions/session'

export default class App extends Application {

  movieStore: MovieStore
  moviesStore: MoviesStore
  torrentStore: TorrentStore
  sessionStore: SessionStore

  movieQueries: MovieQueries
  moviesQueries: MoviesQueries
  torrentQueries: TorrentQueries

  pageActionCreators: PageActionCreators
  sessionActionCreators: SessionActionCreators

  constructor () {
    super()

    this.register({
      movieStore: MovieStore,
      moviesStore: MoviesStore,
      torrentStore: TorrentStore,
      sessionStore: SessionStore,

      movieQueries: MovieQueries,
      moviesQueries: MoviesQueries,
      torrentQueries: TorrentQueries,

      pageActionCreators: PageActionCreators,
      sessionActionCreators: SessionActionCreators
    })
  }

}
