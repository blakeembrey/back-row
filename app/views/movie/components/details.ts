import React = require('react')
import { create } from 'react-free-style'
import { Link } from 'react-router'
import moment = require('moment')
import titleCase = require('title-case')
import Button from '../../../components/button'
import Dropdown from '../../../components/dropdown'
import { Movie } from '../../../stores/movie'
import { Torrent } from '../../../stores/torrent'
import { grid } from '../../../utils/styles'

const Style = create()

const ITEM_PADDING = 8

const MOVIE_TITLE_STYLE = Style.registerStyle({
  margin: '0 0 14px 0',
  fontWeight: 'bold',
  fontSize: '2.5em'
})

const MOVIE_META_STYLE = Style.registerStyle({
  flexDirection: 'row',
  WebkitFlexDirection: 'row',
  flexWrap: 'wrap',
  WebkitFlexWrap: 'wrap'
}, grid(ITEM_PADDING))

const MOVIE_META_ITEM_STYLE = Style.registerStyle({
  fontSize: '0.85em',
  fontWeight: 'bold',
  marginBottom: ITEM_PADDING
})

const MOVIE_DESCRIPTION_STYLE = Style.registerStyle({
  flex: 1,
  WebkitFlex: 1,
  marginBottom: '14px',
  lineHeight: 1.2
})

const MOVIE_FOOTER_STYLE = Style.registerStyle({
  flexDirection: 'row',
  WebkitFlexDirection: 'row',
  alignItems: 'center',
  WebkitAlignItems: 'center',
  flexWrap: 'wrap',
  WebkitFlexWrap: 'wrap'
}, grid(ITEM_PADDING))

const MOVIE_FOOTER_ITEM_STYLE = Style.registerStyle({
  marginBottom: ITEM_PADDING
})

const MOVIE_HEADER_STYLE = Style.registerStyle({
  flexDirection: 'row',
  WebkitFlexDirection: 'row',
  justifyContent: 'space-between',
  WebkitJustifyContent: 'space-between',
  flexWrap: 'wrap',
  WebkitFlexWrap: 'wrap'
}, grid(ITEM_PADDING))

const TORRENT_STYLE = Style.registerStyle({
  flex: '0 0 auto',
  WebkitFlex: '0 0 auto',
  marginBottom: '14px'
})

const TORRENT_SELECT_STYLE = Style.registerStyle({
  right: 0
})

const DOWNLOAD_ITEM_ANIM = Style.registerKeyframes({
  '0%, 20%, 75%, 100%': {
    WebkitTransform: 'translateY(0)',
    transform: 'translateY(0)'
  },
  '50%': {
    WebkitTransform: 'translateY(2px)',
    transform: 'translateY(2px)'
  },
  '40%': {
    WebkitTransform: 'translateY(-6px)',
    transform: 'translateY(-6px)'
  },
  '60%': {
    WebkitTransform: 'translateY(-3px)',
    transform: 'translateY(-3px)'
  }
})

const DOWNLOAD_ITEM_STYLE = Style.registerStyle({
  marginTop: 12,
  marginBottom: 12,

  '&:hover > .fa': {
    WebkitAnimation: DOWNLOAD_ITEM_ANIM.name + ' 2s infinite',
    animation: DOWNLOAD_ITEM_ANIM.name + ' 2s infinite'
  }
})

interface MovieDetailsProps {
  movie: Movie
  torrent: Torrent
  qualities: string[]
  selectQuality: (quality: string) => any
  className: string
}

class MovieDetailsView extends React.Component<MovieDetailsProps, {}> {

  render () {
    const { movie, torrent, qualities } = this.props

    return React.createElement(
      'div',
      {
        className: this.props.className
      },
      React.createElement(
        'div',
        {
          className: MOVIE_HEADER_STYLE.className
        },
        React.createElement(
          'h2',
          {
            className: MOVIE_TITLE_STYLE.className
          },
          movie.title
        ),
        qualities.length ? React.createElement(
          Dropdown,
          {
            className: TORRENT_STYLE.className,
            items: qualities,
            onChange: this.props.selectQuality,
            dropdownClassName: TORRENT_SELECT_STYLE.className
          },
          React.createElement(
            Button,
            null,
            `Quality (${torrent.quality})`,
            React.createElement(
              'i',
              {
                className: 'fa fa-caret-down',
                style: { marginLeft: 10 }
              }
            )
          )
        ) : React.createElement(
          Button,
          {
            className: TORRENT_STYLE.className,
            disabled: true
          },
          'No torrents available'
        )
      ),
      React.createElement(
        'div',
        {
          className: MOVIE_META_STYLE.className
        },
        React.createElement(
          'span',
          {
            className: MOVIE_META_ITEM_STYLE.className
          },
          moment(movie.released).format('MMM YYYY')
        ),
        movie.genres ? React.createElement(
          'span',
          {
            className: MOVIE_META_ITEM_STYLE.className
          },
          movie.genres.map(x => titleCase(x)).join(', ')
        ) : null,
        React.createElement(
          'span',
          {
            className: MOVIE_META_ITEM_STYLE.className
          },
          movie.runtime + ' min'
        ),
        React.createElement(
          'a',
          {
            className: MOVIE_META_ITEM_STYLE.className,
            href: `http://www.imdb.com/title/${movie.imdbId}/`,
            target: '_blank'
          },
          'View on IMDb'
        )
      ),
      React.createElement(
        'div',
        {
          className: MOVIE_DESCRIPTION_STYLE.className
        },
        movie.overview
      ),
      React.createElement(
        'div',
        {
          className: MOVIE_FOOTER_STYLE.className
        },
        torrent ? React.createElement(
          Link,
          {
            className: MOVIE_FOOTER_ITEM_STYLE.className,
            to: 'createSession',
            query: {
              imdbId: movie.imdbId,
              quality: torrent.quality
            }
          },
          React.createElement(Button, null, 'Watch Now')
        ) : null,
        movie.trailer ? React.createElement(
          'a',
          {
            className: MOVIE_FOOTER_ITEM_STYLE.className,
            target: '_blank',
            href: movie.trailer
          },
          React.createElement(Button, null, 'Watch Trailer')
        ) : null,
        torrent ? React.createElement(
          'a',
          {
            className: Style.join(
              MOVIE_FOOTER_ITEM_STYLE.className,
              DOWNLOAD_ITEM_STYLE.className
            ),
            href: torrent.url,
            download: true
          },
          React.createElement('i', {
            className: 'fa fa-download',
            style: { marginRight: 10 }
          }),
          `Download (${torrent.quality})`
        ) : null
      )
    )
  }

}

export default Style.component(MovieDetailsView)
