import userService from "../../services/userService"

export function loadUsers() {
  return async dispatch => {
    const users = await userService.query()
    const action = { type: 'SET_USERS', users }
    dispatch(action)
  }
}
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