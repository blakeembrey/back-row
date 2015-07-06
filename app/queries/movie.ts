import { Queries } from 'marty'
import { trakt } from '../utils/request'
import MoviesConstants from '../constants/movie'

export default class MovieQueries extends Queries {

  getMovie (imdbId: string) {
    this.dispatch(MoviesConstants.RECEIVE_TRAKT_SUMMARY_STARTING, imdbId)

    return trakt(`/movie/summary/{TRAKT_TV_CLIENT_ID}/${imdbId}`)
      .then((res) => this.dispatch(MoviesConstants.RECEIVE_TRAKT_SUMMARY, imdbId, res.body))
      .catch((err) => this.dispatch(MoviesConstants.RECEIVE_TRAKT_SUMMARY_FAILED, imdbId, err))
  }

}
