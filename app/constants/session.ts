import { createConstants } from 'marty'

export default createConstants([
  'CREATE_CONNECTION',
  'CREATE_SESSION',
  'JOIN_SESSION',
  'LEAVE_SESSION',
  'UPDATE_SESSION_STATE',
  'UPDATE_SESSION_OPTIONS',
  'UPDATE_LATENCY'
])
