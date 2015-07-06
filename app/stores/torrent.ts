import { Store } from 'marty'
import TorrentConstants from '../constants/torrent'
import MoviesConstants from '../constants/movies'

export interface Torrent {
  hash: string
  uploaded: number
  peers: number
  seeds: number
  quality: string
  size: number
  url: string
}

export interface TorrentState {
  movies: {
    [imdbId: string]: {
      [quality: string]: Torrent
    }
  }
}

export default class TorrentStore extends Store<TorrentState> {

  state: TorrentState = {
    movies: {}
  }

  handlers = {
    addMovies: [MoviesConstants.RECIEVE_YTS_PAGE, TorrentConstants.RECEIVE_YTS_QUERY]
  }

  getMovie (imdbId: string) {
    return this.fetch({
      id: imdbId,
      locally: () => {
        return this.state.movies[imdbId]
      },
      remotely: () => {
        return this.app.torrentQueries.getMovie(imdbId)
      }
    })
  }

  addTorrent (movie: any) {
    this.state.movies[movie.imdb_code] = {}

    // The movie could be DCMA removed and have no torrents linked.
    if (movie.torrents) {
      movie.torrents.forEach((torrent: any) => {
        this.state.movies[movie.imdb_code][torrent.quality] = {
          hash: torrent.hash,
          uploaded: torrent.date_uploaded_unix,
          peers: torrent.peers,
          seeds: torrent.seeds,
          quality: torrent.quality,
          size: torrent.size_bytes,
          url: torrent.url
        }
      })
    }

    this.hasChanged()
  }

  addMovies (_: any, body: any) {
    body.data.movies.forEach((movie: any) => this.addTorrent(movie))
  }

}
