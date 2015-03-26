var FluxDispatcher = require('flux').Dispatcher
var invariant = require('react/lib/invariant')
var PayloadSources = require('../constants/PayloadSources')

class Dispatcher extends FluxDispatcher {

  handleServerAction (action) {
    invariant(action.type, 'Empty action type: %s', action.type)

    var payload = {
      action: action,
      source: PayloadSources.SERVER_ACTION
    }

    return this.dispatch(payload)
  }

  handleViewAction (action) {
    invariant(action.type, 'Empty action type: %s', action.type)

    var payload = {
      action: action,
      source: PayloadSources.VIEW_ACTION
    }

    return this.dispatch(payload)
  }

}

module.exports = new Dispatcher()
