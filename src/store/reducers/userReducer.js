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
    case 'TRANSFER_COINS':
      return {
        ...state,
        user: { ...state.user, coins: state.user.coins - action.amount }
      }
    default:
      return state
  }
}