var React = require('react')
var style = require('free-style')
var Link = require('react-router').Link
var Colors = require('../constants/Colors')

var HEADER_STYLE = style.createClass({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: Colors.WET_ASPHALT,
  zIndex: 10
})

var TITLE_STYLE = style.createClass({
  fontSize: '1em',
  margin: 0,
  padding: '0.3em',
  lineHeight: 1.5,
  textAlign: 'center',
  display: 'block',
  color: '#fff',
  fontWeight: 'bold',
  textDecoration: 'none'
})

var SPACER_STYLE = style.createClass({
  height: 1 * 1.5 + 0.3 * 2 + 'em'
})

var Header = React.createClass({

  render: function () {
    return (
      <div>
        <header className={HEADER_STYLE.className}>
          <Link to="app" className={TITLE_STYLE.className}>Back Row</Link>
        </header>
        <div className={SPACER_STYLE.className} />
      </div>
    )
  }

})

module.exports = Header

// lots and lots of love
