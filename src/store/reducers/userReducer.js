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
    case 'UPDATE_USER':
      const { updatedUser } = action
      return {
        ...state,
        users: state.users.map(user => user._id === updatedUser._id ? updatedUser : user)
      }
    default:
      return state
  }
}