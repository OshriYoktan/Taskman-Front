const INITIAL_STATE = {
  users: [],
  user: null
}

export function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_USERS':
      return {
        ...state,
        users: action.users
      }
    case 'LOAD_USER':
      return {
        ...state,
        user: action.user
      }
    default:
      return state
  }
}