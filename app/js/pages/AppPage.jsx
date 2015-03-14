var React = require('react')
var Style = require('react-free-style').fresh()
var RouteHandler = require('react-router').RouteHandler
var Header = require('../components/Header.jsx')
var Container = require('../components/Container.jsx')
var Colors = require('../constants/Colors')

var APP_STYLE = Style.registerClass({
  color: '#fff',
  minWidth: '100vw',
  minHeight: '100vh',
  backgroundColor: Colors.MIDNIGHT_BLUE
})

var App = React.createClass({

  mixins: [Style.Mixin],

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
