import { userService } from "../../services/userService"

const INITIAL_STATE = {
  user: userService.getUser() || null
}

export function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
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