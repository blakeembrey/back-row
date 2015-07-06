import React = require('react')
import { Link } from 'react-router'
import { create, injectStyle } from 'react-free-style'
import * as Colors from '../../../utils/colors'

const Style = create()

const HEADER_STYLE = Style.registerStyle({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: Colors.WET_ASPHALT,
  zIndex: 10
})

const TITLE_STYLE = Style.registerStyle({
  fontSize: '1em',
  margin: 0,
  padding: '0.3em',
  lineHeight: 1.5,
  textAlign: 'center',
  display: 'block',
  fontWeight: 'bold',
  textDecoration: 'none'
})

const SPACER_STYLE = Style.registerStyle({
  height: 1 * 1.5 + 0.3 * 2 + 'em'
})

@injectStyle(Style)
export default class Header extends React.Component<{}, {}> {

  render () {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'header',
        { className: HEADER_STYLE.className },
        React.createElement(
          Link,
          { to: 'app', className: TITLE_STYLE.className },
          'Back Row'
        )
      ),
      React.createElement('div', { className: SPACER_STYLE.className })
    )
  }

}

// lots and lots of love
