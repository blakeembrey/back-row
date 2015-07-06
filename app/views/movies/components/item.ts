import React = require('react')
import { create } from 'react-free-style'
import { Link } from 'react-router'
import * as Colors from '../../../utils/colors'

const Style = create()

const BORDER = 3
const WIDTH = ~~((138 * 0.95) + BORDER)
const HEIGHT = ~~((207 * 0.95) + BORDER)

const ITEM_CONTAINER_STYLE = Style.registerStyle({
  paddingTop: 5,
  paddingBottom: 5
})

const TITLE_STYLE = Style.registerStyle({
  margin: '6px 0 0',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
})

const COVER_STYLE = Style.registerStyle({
  width: WIDTH,
  height: HEIGHT,
  borderRadius: BORDER,
  border: '2px solid ' + Colors.CLOUDS,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
})

const COVER_OVERLAY_STYLE = Style.registerStyle({
  opacity: 0,
  backgroundColor: '#000',
  flex: 1,
  WebkitFlex: 1
})

const ITEM_STYLE = Style.registerStyle({
  width: WIDTH,
  fontSize: '0.8em',
  textDecoration: 'none',

  [`&:hover ${COVER_STYLE.selector}`]: {
    borderColor: Colors.ALIZARIN
  },

  [`&:hover ${COVER_OVERLAY_STYLE.selector}`]: {
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
    const { imdbId, cover, title} = this.props

    const backgroundStyle = {
      backgroundImage: Style.url(cover)
    }

    return React.createElement(
      'div',
      {
        className: ITEM_CONTAINER_STYLE.className
      },
      React.createElement(
        Link,
        {
          to: 'movie',
          params: { imdbId },
          className: ITEM_STYLE.className
        },
        React.createElement(
          'div',
          {
            className: COVER_STYLE.className,
            style: backgroundStyle
          },
          React.createElement(
            'div',
            {
              className: COVER_OVERLAY_STYLE.className
            }
          )
        ),
        React.createElement('p', {
          className: TITLE_STYLE.className
        }, title)
      )
    )
  }

}

export default Style.component(MovieItem)
