import React = require('react')
import List = require('react-list')
import { create } from 'react-free-style'
import { createContainer } from 'marty'
import Spinner from '../../components/spinner'
import { Summary } from '../../stores/movies'
import MovieItem from './components/item'
import { grid } from '../../utils/styles'
import Application from '../../app'

var Style = create()

var LIST_STYLE = Style.registerStyle({
  flexWrap: 'wrap',
  WebkitFlexWrap: 'wrap',
  flexDirection: 'row',
  WebkitFlexDirection: 'row',
  justifyContent: 'space-between',
  WebkitJustifyContent: 'space-between'
}, grid(10))

var LIST_CONTAINER_STYLE = Style.registerStyle({
  flex: 1,
  WebkitFlex: 1,
  alignItems: 'center',
  WebkitAlignItems: 'center',
  justifyContent: 'center',
  WebkitJustifyContent: 'center',
  overflow: 'hidden',
  padding: '5px 15px'
})

interface MoviesProps {
  movies: Summary[]
  isLoading: boolean
  count: number
  hasMore: boolean
  app: Application
}

interface ScrollListProps {
  isLoading: boolean
  loadMore: (from: number, size: number) => any
  hasMore: boolean
}

class MoviesView extends React.Component<MoviesProps, {}> {

  loading = false

  componentWillUpdate (nextProps: MoviesProps) {
    this.loading = nextProps.isLoading
  }

  render () {
    var length = this.props.movies.length

    return React.createElement(
      'div',
      { className: LIST_CONTAINER_STYLE.className },
      React.createElement(
        List,
        {
          type: 'uniform',
          itemsRenderer: (items: any[], ref: string) => {
            return React.createElement('div', { className: LIST_STYLE.className, ref }, items)
          },
          itemRenderer: (index: number, key: any) => {
            var movie = this.props.movies[index]

            if (index >= length) {
              if (!this.loading) {
                this.loading = true

                setImmediate(() => this.props.app.moviesQueries.getPage(this.props.count, 50))
              }

              return null
            }

            return React.createElement(MovieItem, {
              key,
              imdbId: movie.imdbId,
              title: movie.title,
              cover: movie.cover
            })
          },
          length: length + (this.props.hasMore ? 1 : 0)
        }
      ),
      this.props.isLoading ? React.createElement(Spinner) : null
    )
  }

}

export default createContainer(Style.component(MoviesView), {
  listenTo: 'moviesStore',
  fetch: {
    movies () {
      return this.app.moviesStore.getMovies()
    },
    count () {
      return this.app.moviesStore.getCount()
    },
    isLoading () {
      return this.app.moviesStore.isLoading()
    },
    hasMore () {
      return this.app.moviesStore.hasMore()
    }
  }
})
