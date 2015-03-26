var React = require('react')
var Style = require('react-free-style').create()
var RouteHandler = require('react-router').RouteHandler
var Header = require('../components/Header.jsx')
var Container = require('../components/Container.jsx')
var Colors = require('../constants/Colors')

var APP_STYLE = Style.registerStyle({
  color: '#fff',
  minWidth: '100vw',
  minHeight: '100vh',
  backgroundColor: Colors.MIDNIGHT_BLUE
})

var App = React.createClass({

  mixins: [Style.Mixin],

  render () {
    return (
      <div className={APP_STYLE.className}>
        <Header />

        <Container>
          <RouteHandler />
        </Container>

        <Style.Element />
      </div>
    )
  }

})

module.exports = App
