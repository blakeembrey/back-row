/// <reference path='../react/react.d.ts' />

declare module 'react-router' {
  import React = require('react')

  export class Route extends React.Component<{ name: string; path: string; handler: React.ComponentClass<any> }, {}> {

  }

  export class Redirect extends React.Component<{}, {}> {

  }

  export class Handler extends React.Component<{}, {}> {

  }

  export class Link extends React.Component<{}, {}> {

  }

  export class RouteHandler extends React.Component<{}, {}> {

  }

  export function run (routes: React.ReactElement<{}>, cb: (handler: typeof Handler) => void): void
}
