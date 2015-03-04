var React = require('react')
var style = require('free-style')
var RouteHandler = require('react-router').RouteHandler
var Header = require('../components/Header.jsx')
var Container = require('../components/Container.jsx')

var APP_STYLE = style.createClass({
  color: '#fff',
  minWidth: '100vw',
  minHeight: '100vh',
  backgroundColor: '#17181b'
})

var App = React.createClass({
  render: function () {
    return (
      <div className={APP_STYLE.className}>
        <Header />

        <Container>
          <RouteHandler />
        </Container>
      </div>
    )
  }
})

module.exports = App
