var React = require('react')
var Router = require('react-router')
var AppPage = require('./pages/AppPage.jsx')
var MoviePage = require('./pages/MoviePage.jsx')
var MoviesListPage = require('./pages/MoviesListPage.jsx')
var MovieWatchPage = require('./pages/MovieWatchPage.jsx')
var MovieDetailsPage = require('./pages/MovieDetailsPage.jsx')
var Route = Router.Route
var Redirect = Router.Redirect

var routes = (
  <Route name="app" path="/" handler={AppPage}>
    <Redirect path="/" to="movies" />

    <Route name="movies" path="/movies" handler={MoviesListPage} />

    <Route name="movie" path="/movies/:imdbId" handler={MoviePage}>
      <Route handler={MovieDetailsPage} />

      <Route name="watchMovie" path="/movies/:imdbId/watch" handler={MovieWatchPage} />
    </Route>
  </Route>
)

Router.run(routes, function (Handler) {
  React.render(<Handler />, document.body)
})
