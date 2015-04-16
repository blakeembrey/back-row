import popsicle = require('popsicle')
import status = require('popsicle-status')
import resolve = require('popsicle-resolve')
import constants = require('popsicle-constants')
import * as Config from './config'

export function request (opts: popsicle.Options) {
  return popsicle(opts)
    .use(constants(Config))
}

export function basic (opts: popsicle.Options) {
  return request(opts)
    .use(status())
}

export function yts (opts: popsicle.Options) {
  return request(opts)
    .use(resolve(`${Config.BASE_URL}/proxy/yts`))
    .use(status())
}

export function trakt (opts: popsicle.Options) {
  return request(opts)
    .use(function (req) {
      req.set('trakt-api-version', '2')
      req.set('trakt-api-key', process.env.TRAKT_TV_CLIENT_ID)
    })
    .use(resolve(`${Config.BASE_URL}/proxy/trakt`))
    .use(status())
    .after(function (res) {
      if (res.body && res.body.error) {
        return Promise.reject(res.error(res.body.error))
      }
    })
}
