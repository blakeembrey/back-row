import { Store } from 'marty'
import MovieConstants from '../constants/movie'

export interface Movie {
  imdbId: string
  overview: string
  certification: string
  genres: string[]
  released: number
  runtime: number
  title: string
  trailer: string
  tagline: string
  posterImage: string
  backgroundImage: string
}

export interface MovieState {
  movies: {
    [imdbId: string]: Movie
  }
}

class MovieStore extends Store<MovieState> {

  state: MovieState = {
    movies: {}
  }

  handlers = {
    addMovie: MovieConstants.RECEIVE_TRAKT_SUMMARY
  }

  getMovie (imdbId: string) {
    return this.fetch({
      id: imdbId,
      locally: () => {
        return this.state.movies[imdbId]
      },
      remotely: () => {
        return this.app.movieQueries.getMovie(imdbId)
      }
    })
  }

  addMovie (imdbId: string, body: any) {
    this.state.movies[imdbId] = {
      imdbId: imdbId,
      overview: body.overview,
      certification: body.certification,
      genres: body.genres,
      released: body.released * 1000,
      runtime: body.runtime,
      title: body.title,
      trailer: body.trailer,
      tagline: body.tagline,
      posterImage: body.images.poster,
      backgroundImage: body.images.fanart
    }

    this.hasChanged()
  }

}

export default MovieStore
