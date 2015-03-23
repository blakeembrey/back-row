var React = require('react')
var Style = require('react-free-style').create()

var CONTAINER_STYLE = Style.registerStyle({
  minWidth: '100%',
  minHeight: 'calc(100vh - 34px)',
  position: 'relative'
})

var Header = React.createClass({

  mixins: [Style.Mixin],

  render: function () {
    return (
      <div className={CONTAINER_STYLE.className}>
        {this.props.children}
      </div>
    )
  }

})

module.exports = Header
