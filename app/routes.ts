import React = require('react')
import { Route, Redirect, run } from 'react-router'
import { ApplicationContainer } from 'marty'

import Application from './app'

import App from './views/app/handler'
import Movies from './views/movies/handler'
import Movie from './views/movie/handler'
import CreateSession from './views/session/create'
import Session from './views/session/handler'

const routes = React.createElement(
  Route,
  { name: 'app', path: '/', handler: App },
  React.createElement(Redirect, { path: '/', to: 'movies' }),
  React.createElement(Route, { name: 'movies', path: 'movies', handler: Movies }),
  React.createElement(Route, { name: 'movie', path: 'movies/:imdbId', handler: Movie }),
  React.createElement(Route, { name: 'createSession', path: 'session', handler: CreateSession }),
  React.createElement(Route, { name: 'session', path: 'session/:sessionId', handler: Session })
)

export function attach (element: HTMLElement): void {
  const app = new Application()

  run(routes, function (Handler) {
    React.render(
      React.createElement(
        ApplicationContainer,
        { app },
        React.createElement(Handler)
      ),
      element
    )
  })
}
