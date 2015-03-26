var url = require('url')

/**
 * Select the optimal dppx size.
 */
var DPPX = [1, 1.5, 2, 2.5, 3, 3.5, 4].reduce(function (result, dppx) {
  if (!window.matchMedia) {
    return result
  }

  var mediaQuery = '(min-resolution: ' + dppx + 'dppx)'

  return window.matchMedia(mediaQuery).matches ? dppx : result
})

/**
 * Trakt.tv image dimensions.
 *
 * @type {Object}
 */
var TRAKT_SIZES = {
  posters: [
    [300, 'thumb'],
    [600, 'medium'],
    [1000, 'original']
  ],
  fanarts: [
    [853, 'thumb'],
    [1280, 'medium'],
    [1920, 'original']
  ]
}

/**
 * Replace Trakt.tv URIs with the available size.
 *
 * @param  {Object} uri
 * @param  {Number} width
 * @return {String}
 */
function resizeTraktImage (uri, width) {
  var keys = Object.keys(TRAKT_SIZES)

  function reduce (sizes) {
    return sizes.reduce(function (a, b) {
      return b[0] > width ? a : b
    })[1]
  }

  for (var i = 0; i < keys.length; i++) {
    var name = keys[i]

    if (uri.pathname.indexOf('/' + name + '/') === -1) {
      continue
    }

    uri.pathname = uri.pathname
      .replace('/original/', '/' + reduce(TRAKT_SIZES[name]) + '/')
  }
}

/**
 * Resize an image to the optimal size.
 *
 * @param  {String} imageSrc
 * @param  {Number} baseSize
 * @return {String}
 */
function resizeImage (imageSrc, baseSize) {
  var uri  = url.parse(imageSrc)
  var size = baseSize * DPPX

  // Trakt.tv images.
  if (/trakt\.us$/.test(uri.hostname)) {
    resizeTraktImage(uri, size)
  }

  return url.format(uri)
}

module.exports = resizeImage
