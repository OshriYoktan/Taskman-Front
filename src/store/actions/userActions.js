import { userService } from "../../services/userService"

export function loadUser(username) {
  userService.signUp(username)
  return async dispatch => {
    const user = await userService.getUser()
    const action = {
      type: 'LOAD_USER',
      user
    }
    dispatch(action)
  }
}

export function transferCoins(amount, contactId) {
  // let user = userService.getUser(contactId)
  return async dispatch => {
    const action = {
      type: 'TRANSFER_COINS',
      amount
    }
    dispatch(action)
  }
}