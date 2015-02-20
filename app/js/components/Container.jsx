var React = require('react')

var CONTAINER_STYLE = {
  minWidth: '100%',
  minHeight: 'calc(100vh - 34px)',
  position: 'relative'
}

var Header = React.createClass({

  render: function () {
    return (
      <div style={CONTAINER_STYLE}>
        {this.props.children}
      </div>
    )
  }

})

module.exports = Header
