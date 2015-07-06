import React = require('react')
import chroma = require('chroma-js')
import OnClickOutsideMixin = require('react-onclickoutside')
import { create } from 'react-free-style'
import * as Colors from '../utils/colors'

const Style = create()

const DROPDOWN_STYLE = Style.registerStyle({
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

const DROPDOWN_ACTIVE_STYLE = Style.registerStyle({
  display: 'block'
})

const DROPDOWN_ITEM_STYLE = Style.registerStyle({
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

interface DropdownProps {
  items: any[]
  renderLabel: (item: any) => string
}

interface DropdownState {
  open: boolean
}

const Dropdown = React.createClass({

  mixins: [OnClickOutsideMixin],

  getInitialState (): DropdownState {
    return {
      open: false
    }
  },

  getDefaultProps (): DropdownProps {
    return {
      items: [],
      renderLabel (item: any) {
        return item
      }
    }
  },

  renderItem (item: any, index: number) {
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

  onChange (item: any, index: number) {
    this.setState({ open: false })
    this.props.onChange(item, index)
  },

  onToggle () {
    this.setState({ open: !this.state.open })
  },

  handleClickOutside () {
    this.setState({ open: false })
  },

  render () {
    const items = this.props.items
      .map((item: any, index: number) => {
        return this.renderItem(item, index)
      })

    return React.createElement(
      'div',
      {
        className: this.props.className
      },
      React.createElement(
        'div',
        {
          onClick: this.onToggle
        },
        this.props.children
      ),
      React.createElement(
        'div',
        {
          role: 'menu',
          className: Style.join(DROPDOWN_STYLE.className, this.state.open ? DROPDOWN_ACTIVE_STYLE.className : null, this.props.dropdownClassName)
        },
        items
      )
    )
  }

})

export default Style.component(Dropdown)
