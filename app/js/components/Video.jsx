var React = require('react')
var Style = require('react-free-style')
var videojs = require('video.js')

var VIDEO_WRAPPER_STYLE = Style.registerStyle({
  flex: 1,
  padding: '2em',
  justifyContent: 'center',
  alignItems: 'center',

  '.video-js': {
    flex: 1
  },

  '.vjs-poster': {
    backgroundSize: 'cover'
  }
})

var Video = React.createClass({

  propTypes: {
    poster: React.PropTypes.string,
    src: React.PropTypes.string.isRequired
  },

  componentDidMount: function () {
    var target = this.refs.target.getDOMNode()
    var video = document.createElement('video')

    target.appendChild(video)
    video.src = this.props.src
    video.className = 'video-js vjs-default-skin vjs-big-play-centered'

    videojs(video, {
      controls: true,
      preload: 'auto',
      poster: this.props.poster,
      width: '100%',
      height: '100%'
    })
  },

  render: function () {
    return (
      <div ref="target" className={VIDEO_WRAPPER_STYLE.className} />
    )
  }

})

module.exports = Video
