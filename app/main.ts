import * as Marty from 'marty'
import * as React from 'react/addons'
import { polyfill } from 'es6-promise'
import { attach } from './routes'

polyfill()

attach(document.body)

// Enable Marty developer tools.
;(<any>window).Marty = Marty
;(<any>window).React = React
