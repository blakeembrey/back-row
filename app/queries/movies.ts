import { Queries } from 'marty'
import MoviesConstants from '../constants/movies'
import { yts } from '../utils/request'

export default class MoviesQueries extends Queries {

  getPage (from: number, limit: number) {
    const page = Math.ceil((from + limit) / limit)

    this.dispatch(MoviesConstants.RECIEVE_YTS_PAGE_STARTING, page)

    return yts(`/v2/list_movies.json?sort_by=peers&limit=${limit}&page=${page}`)
      .then((res) => this.dispatch(MoviesConstants.RECIEVE_YTS_PAGE, page, res.body))
      .catch((err) => this.dispatch(MoviesConstants.RECIEVE_YTS_PAGE_FAILED, page, err))
  }

}
