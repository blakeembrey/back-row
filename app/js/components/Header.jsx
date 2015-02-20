var React = require('react')
var style = require('free-style')
var Link = require('react-router').Link

var HEADER_STYLE = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  boxShadow: '0px -4px 8px 6px rgba(0, 0, 0, 0.9)',
  backgroundColor: '#17181b',
  zIndex: 10
})

var TITLE_STYLE = style({
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

var SPACER_STYLE = style({
  height: 1 * 1.5 + 0.3 * 2 + 'em'
})

var Header = React.createClass({

  render: function () {
    return (
      <div>
        <header style={HEADER_STYLE}>
          <Link to="app" style={TITLE_STYLE}>Back Row</Link>
        </header>
        <div style={SPACER_STYLE} />
      </div>
    )
  }

})

module.exports = Header

// lots and lots of love
