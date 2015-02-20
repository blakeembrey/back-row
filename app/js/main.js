require('es6-promise').polyfill()

insertStylesheet('/vendor/normalize/normalize.css')
insertStylesheet('/vendor/videojs/video-js.min.css')
insertStylesheet('/css/main.css')

function insertStylesheet (href) {
  var link = document.createElement('link')

  link.rel = 'stylesheet'
  link.href = href

  document.head.appendChild(link)
}

require('./routes.jsx')
