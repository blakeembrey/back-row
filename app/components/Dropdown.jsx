var React = require('react')
var Style = require('react-free-style').create()
var chroma = require('chroma-js')
var Colors = require('../constants/Colors')
var Button = require('./Button.jsx')

var DROPDOWN_STYLE = Style.registerStyle({
  position: 'absolute',
  display: 'none',
  minWidth: 220,
  marginTop: 9,
  fontSize: 14,
  backgroundColor: Colors.CLOUDS,
  border: 'none',
  borderRadius: 3,
  zIndex: 10,
  overflow: 'hidden'
})

var DROPDOWN_ACTIVE_STYLE = Style.registerStyle({
  display: 'block'
})

var DROPDOWN_ITEM_STYLE = Style.registerStyle({
  display: 'block',
  padding: '8px 16px',
  clear: 'both',
  fontWeight: 400,
  lineHeight: 1.42857143,
  color: Colors.MIDNIGHT_BLUE,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'border .25s linear, color .25s linear, background-color .25s linear',

  '&:hover': {
    backgroundColor: Colors.SILVER
  }
})

var Button = React.createClass({

  mixins: [Style.Mixin, require('react-onclickoutside')],

  propTypes: {
    items: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  getInitialState () {
    return {
      open: false
    }
  },

  getDefaultProps () {
    return {
      items: [],
      renderLabel (item) {
        return item
      }
    }
  },

  renderItem (item, index) {
    return React.createElement(
      'div',
      {
        key: index,
        onClick: () => this.onChange(item, index),
        className: DROPDOWN_ITEM_STYLE.className
      },
      this.props.renderLabel(item)
    )
  },

  onChange (item, index) {
    this.setState({ open: false })
    this.props.onChange(item, index)
  },

  onToggle (event) {
    this.setState({ open: !this.state.open })
  },

  handleClickOutside () {
    this.setState({ open: false })
  },

  render () {
    var items = this.props.items
      .map((item, index) => {
        return this.renderItem(item, index)
      })

    return (
      <div className={this.props.className}>
        <div onClick={this.onToggle}>{this.props.children}</div>
        <div role='menu' className={Style.join(DROPDOWN_STYLE.className, this.state.open ? DROPDOWN_ACTIVE_STYLE.className : null, this.props.dropdownClassName)}>
          {items}
        </div>
      </div>
    )
  }

})

module.exports = Button
