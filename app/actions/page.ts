import { ActionCreators } from 'marty'

class PageActionCreators extends ActionCreators {

  title (title: string) {
    document.title = (title ? title + ' • ' : '') + 'Back Row'
  }

}

export default PageActionCreators
