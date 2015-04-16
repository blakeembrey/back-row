import { createConstants } from 'marty'

var SessionConstants = createConstants([
  'CREATE_CONNECTION',
  'CREATE_SESSION',
  'JOIN_SESSION',
  'LEAVE_SESSION',
  'UPDATE_SESSION_STATE',
  'UPDATE_SESSION_OPTIONS'
])

export default SessionConstants
