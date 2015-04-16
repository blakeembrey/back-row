import React = require('react')
import { create } from 'react-free-style'
import { Link } from 'react-router'
import * as Colors from '../../../utils/colors'

var Style = create()

var BORDER = 3
var WIDTH = ~~((138 * 0.95) + BORDER)
var HEIGHT = ~~((207 * 0.95) + BORDER)

var TITLE_STYLE = Style.registerStyle({
  margin: '6px 0 0',
  color: Colors.CLOUDS,
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
})

var COVER_STYLE = Style.registerStyle({
  width: WIDTH,
  height: HEIGHT,
  borderRadius: BORDER,
  backgroundColor: '#000',
  border: '2px solid ' + Colors.CLOUDS,
  overflow: 'hidden'
})

var BACKGROUND_STYLE = Style.registerStyle({
  flex: 1,
  WebkitFlex: 1,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})

var ITEM_STYLE = Style.registerStyle({
  margin: '0.8em',
  width: WIDTH,
  fontSize: '0.8em',
  textDecoration: 'none',

  ['&:hover ' + COVER_STYLE.selector]: {
    borderColor: Colors.ALIZARIN
  },

  ['&:hover ' + BACKGROUND_STYLE.selector]: {
    opacity: 0.5
  }
})

interface MovieItemProps {
  cover: string;
  title: string;
  imdbId: string;
}

class MovieItem extends React.Component<MovieItemProps, {}> {

  render () {
    var { imdbId, cover, title} = this.props

    var backgroundStyle = {
      backgroundImage: Style.url(cover)
    }

    return React.createElement(
      Link,
      { to: 'movie', params: { imdbId }, className: ITEM_STYLE.className },
      React.createElement(
        'div',
        { className: COVER_STYLE.className },
        React.createElement(
          'div',
          { className: BACKGROUND_STYLE.className, style: backgroundStyle }
        )
      ),
      React.createElement('p', { className: TITLE_STYLE.className }, title)
    )
  }

}

export default Style.component(MovieItem)
