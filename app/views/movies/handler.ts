import React = require('react')
import List = require('react-list')
import { create } from 'react-free-style'
import { createContainer } from 'marty'
import Spinner from '../../components/spinner'
import { Summary } from '../../stores/movies'
import MovieItem from './components/item'
import { grid } from '../../utils/styles'
import App from '../../app'

const PAGE_SIZE = 40

const Style = create()

const LIST_STYLE = Style.registerStyle({
  flexWrap: 'wrap',
  WebkitFlexWrap: 'wrap',
  flexDirection: 'row',
  WebkitFlexDirection: 'row',
  justifyContent: 'space-between',
  WebkitJustifyContent: 'space-between'
}, grid(5))

const LIST_CONTAINER_STYLE = Style.registerStyle({
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
  app: App
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
    const length = this.props.movies.length

    this.props.app.pageActionCreators.title('Movies')

    return React.createElement(
      'div',
      { className: LIST_CONTAINER_STYLE.className },
      React.createElement(
        List,
        {
          type: 'uniform',
          pageSize: PAGE_SIZE,
          itemsRenderer: (items: any[], ref: string) => {
            return React.createElement('div', { className: LIST_STYLE.className, ref }, items)
          },
          itemRenderer: (index: number, key: any) => {
            const movie = this.props.movies[index]

            if (index === length - 1 && !this.loading) {
              this.loading = true

              setImmediate(() => {
                this.props.app.moviesStore.getMovies(this.props.count, PAGE_SIZE)
              })
            }

            return React.createElement(MovieItem, {
              key,
              imdbId: movie.imdbId,
              title: movie.title,
              cover: movie.cover
            })
          },
          length: length
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
      return this.app.moviesStore.getMovies(0, PAGE_SIZE)
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
  },
  pending () {
    return React.createElement(Spinner)
  }
})
