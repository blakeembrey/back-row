var React = require('react')
var Style = require('react-free-style').create()
var Link = require('react-router').Link
var moment = require('moment')
var titleCase = require('title-case')
var Button = require('./Button.jsx')
var Colors = require('../constants/Colors')

var MOVIE_TITLE_STYLE = Style.registerStyle({
  margin: '0 0 0.8em 0',
  fontWeight: 'bold',
  fontSize: '2.5em'
})

var MOVIE_META_STYLE = Style.registerStyle({
  flexDirection: 'row',
  marginBottom: '0.8em'
})

var MOVIE_META_ITEM_STYLE = Style.registerStyle({
  fontSize: '0.85em',
  fontWeight: 'bold',

  '& + &': {
    marginLeft: '1em'
  }
})

var MOVIE_DESCRIPTION_STYLE = Style.registerStyle({
  flex: 1,
  marginBottom: '0.8em',
  lineHeight: 1.2
})

var MOVIE_FOOTER_STYLE = Style.registerStyle({
  flexDirection: 'row'
})

var MOVIE_FOOTER_ITEM_STYLE = Style.registerStyle({
  '& + &': {
    marginLeft: '1em'
  }
})

var TRAILER_LINK_STYLE = Style.registerStyle({
  color: Colors.ALIZARIN
})

var MovieDetails = React.createClass({

  mixins: [Style.Mixin],

  propTypes: {
    movie: React.PropTypes.object.isRequired
  },

  render () {
    var movie = this.props.movie

    return (
      <div className={this.props.className}>
        <h2 className={MOVIE_TITLE_STYLE.className}>{movie.title}</h2>

        <div className={MOVIE_META_STYLE.className}>
          <span className={MOVIE_META_ITEM_STYLE.className}>{moment(movie.released).format('MMM YYYY')}</span>

          <span className={MOVIE_META_ITEM_STYLE.className}>{movie.genres.map(titleCase).join(', ')}</span>

          <span className={MOVIE_META_ITEM_STYLE.className}>{movie.runtime + ' min'}</span>

          <a className={Style.join(MOVIE_META_ITEM_STYLE.className, TRAILER_LINK_STYLE.className)} href={'http://www.imdb.com/title/' + movie.imdbId}>IMDb</a>
        </div>

        <div className={MOVIE_DESCRIPTION_STYLE.className}>{movie.overview}</div>

        <div className={MOVIE_FOOTER_STYLE.className}>
          <Link className={MOVIE_FOOTER_ITEM_STYLE.className} to="watchMovie" params={{ imdbId: movie.imdbId }}>
            <Button>Watch Now</Button>
          </Link>

          <a className={MOVIE_FOOTER_ITEM_STYLE.className} href={movie.trailer}>
            <Button>Watch Trailer</Button>
          </a>
        </div>
      </div>
    )
  }

})

module.exports = MovieDetails
