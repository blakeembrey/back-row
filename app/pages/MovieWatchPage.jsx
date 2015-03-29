var React = require('react')
var Style = require('react-free-style').create()
var Video = require('../components/Video.jsx')
var MovieActions = require('../actions/MovieActions')

var CONTAINER_STYLE = Style.registerStyle({
  flex: 1
})

var TITLE_STYLE = Style.registerStyle({
  fontSize: '2em',
  margin: 0,
  padding: '0.5em',
  textAlign: 'center'
})

var MovieWatchPage = React.createClass({

  mixins: [Style.Mixin],

  propTypes: {
    movie: React.PropTypes.object.isRequired,
    torrent: React.PropTypes.object.isRequired
  },

  render () {
    var movie = this.props.movie
    var torrent = this.props.torrent

    return (
      <div className={CONTAINER_STYLE.className}>
        <h2 className={TITLE_STYLE.className}>{movie.title} ({torrent.quality})</h2>

        <Video
          src={'/torrent/stream?uri=' + encodeURIComponent(torrent.url)}
          poster={movie.backgroundImage} />
      </div>
    )
  }

})

module.exports = MovieWatchPage
