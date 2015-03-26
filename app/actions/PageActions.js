var PageActions = {

  setTitle (title) {
    // Avoid using dispatcher because it'll trigger mid-cycle.
    // TODO: Fix issue.
    document.title = (title ? title + ' • ' : '') + 'Back Row'
  }

}

module.exports = PageActions
