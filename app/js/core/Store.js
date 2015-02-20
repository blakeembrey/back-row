var util = require('util')
var extend = require('extend')
var EventEmitter = require('events').EventEmitter
var invariant = require('react/lib/invariant')

var CHANGE_EVENT = 'change'

var RESERVED_MESSAGE = '"%s" is a reserved name and not allowed as a method'

class Store extends EventEmitter {
  constructor (methods) {
    var self = this

    invariant(!methods.Mixin, RESERVED_MESSAGE, 'Mixin')
    invariant(!methods.dispatcherToken, RESERVED_MESSAGE, 'dispatcherToken')

    extend(this, methods)

    this.Mixin = {
      componentWillMount: function () {
        self.addChangeListener(this.onChange)
      },

      componentWillUnmount: function () {
        self.removeChangeListener(this.onChange)
      }
    }
  }

  emitChange () {
    this.emit(CHANGE_EVENT)
  }

  addChangeListener (cb) {
    this.on(CHANGE_EVENT, cb)
  }

  removeChangeListener (cb) {
    this.removeListener(CHANGE_EVENT, cb)
  }
}

module.exports = Store
