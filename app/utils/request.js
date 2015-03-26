var popsicle = require('popsicle')
var status = require('popsicle-status')
var prefix = require('popsicle-prefix')
var constants = require('popsicle-constants')
var Config = require('../constants/Config')

exports.basic = requestBasic
exports.trakt = requestTraktTv
exports.yts   = requestYts

function request (opts) {
  return popsicle(opts)
    .use(constants(Config))
}

function requestBasic (opts) {
  return request(opts)
    .use(status())
}

function requestYts (opts) {
  return request(opts)
    .use(prefix('/proxy/yts'))
    .use(status())
}

function requestTraktTv (opts) {
  return request(opts)
    .use(prefix('/proxy/trakt'))
    .use(status())
    .after(function (res) {
      if (res.body && res.body.error) {
        return Promise.reject(res.error(res.body.error))
      }
    })
}
