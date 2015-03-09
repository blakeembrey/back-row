var React = require('react')
var style = require('free-style')

var CONTAINER_STYLE = style.registerClass({
  minWidth: '100%',
  minHeight: 'calc(100vh - 34px)',
  position: 'relative'
})

var Header = React.createClass({

  render: function () {
    return (
      <div className={CONTAINER_STYLE.className}>
        {this.props.children}
      </div>
    )
  }

})

module.exports = Header
