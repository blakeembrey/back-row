var React = require('react')
var style = require('free-style')
var videojs = require('video.js')

var VIDEO_WRAPPER_STYLE = style({
  flex: 1,
  padding: '2em',
  justifyContent: 'center',
  alignItems: 'center'
})

var MoviePoster = React.createClass({

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
      width: 640,
      height: 360
    })
  },

  render: function () {
    return (
      <div ref="target" style={VIDEO_WRAPPER_STYLE} />
    )
  }

})

module.exports = MoviePoster
