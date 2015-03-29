var React = require('react')
var Style = require('react-free-style').create()
var Link = require('react-router').Link
var moment = require('moment')
var titleCase = require('title-case')
var Button = require('./Button.jsx')
var Dropdown = require('./Dropdown.jsx')
var Colors = require('../constants/Colors')

var MOVIE_TITLE_STYLE = Style.registerStyle({
  margin: '0 0 14px 0',
  fontWeight: 'bold',
  fontSize: '2.5em'
})

var MOVIE_META_STYLE = Style.registerStyle({
  flexDirection: 'row',
  marginBottom: '14px'
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
  marginBottom: '14px',
  lineHeight: 1.2
})

var MOVIE_FOOTER_STYLE = Style.registerStyle({
  flexDirection: 'row',
  alignItems: 'center'
})

var MOVIE_FOOTER_ITEM_STYLE = Style.registerStyle({
  '& + &': {
    marginLeft: '1em'
  }
})

var TRAILER_LINK_STYLE = Style.registerStyle({
  color: Colors.ALIZARIN
})

var MOVIE_HEADER_STYLE = Style.registerStyle({
  flexDirection: 'row',
  justifyContent: 'space-between',
  flexWrap: 'wrap'
})

var TORRENT_STYLE = Style.registerStyle({
  flex: '0 0 auto',
  marginBottom: '14px'
})

var TORRENT_SELECT_STYLE = Style.registerStyle({
  right: 0
})

var MovieDetails = React.createClass({

  mixins: [Style.Mixin],

  propTypes: {
    movie: React.PropTypes.object.isRequired,
    torrent: React.PropTypes.object.isRequired,
    torrents: React.PropTypes.array.isRequired,
    selectTorrent: React.PropTypes.func.isRequired
  },

  selectTorrent (torrent) {
    this.props.selectTorrent(torrent)
  },

  render () {
    var movie = this.props.movie
    var torrent = this.props.torrent

    return (
      <div className={this.props.className}>
        <div className={MOVIE_HEADER_STYLE.className}>
          <h2 className={MOVIE_TITLE_STYLE.className}>{movie.title}</h2>

          <Dropdown className={TORRENT_STYLE.className} items={this.props.torrents} renderLabel={(item) => item.quality} onChange={this.selectTorrent} dropdownClassName={TORRENT_SELECT_STYLE.className}>
            <Button>Quality ({torrent.quality}) <i className="fa fa-caret-down" style={{ marginLeft: 5 }} /></Button>
          </Dropdown>
        </div>

        <div className={MOVIE_META_STYLE.className}>
          <span className={MOVIE_META_ITEM_STYLE.className}>{moment(movie.released).format('MMM YYYY')}</span>

          {movie.genres.length ? <span className={MOVIE_META_ITEM_STYLE.className}>{movie.genres.map(titleCase).join(', ')}</span> : null}

          <span className={MOVIE_META_ITEM_STYLE.className}>{movie.runtime + ' min'}</span>

          <a className={Style.join(MOVIE_META_ITEM_STYLE.className, TRAILER_LINK_STYLE.className)} href={'http://www.imdb.com/title/' + movie.imdbId} target='_blank'>IMDb</a>
        </div>

        <div className={MOVIE_DESCRIPTION_STYLE.className}>{movie.overview}</div>

        <div className={MOVIE_FOOTER_STYLE.className}>
          <Link className={MOVIE_FOOTER_ITEM_STYLE.className} to='watchMovie' params={{ imdbId: movie.imdbId }}>
            <Button>Watch Now</Button>
          </Link>

          <a className={MOVIE_FOOTER_ITEM_STYLE.className} href={movie.trailer} target='_blank'>
            <Button>Watch Trailer</Button>
          </a>

          <a href={torrent.url} className={MOVIE_FOOTER_ITEM_STYLE.className}>
            <i className={'fa fa-download'}></i>
          </a>
        </div>
      </div>
    )
  }

})

module.exports = MovieDetails
