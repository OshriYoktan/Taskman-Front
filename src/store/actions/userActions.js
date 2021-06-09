import userService from "../../services/userService"

export function loadUsers() {
  return async dispatch => {
    const users = await userService.query()
    const action = { type: 'SET_USERS', users }
    dispatch(action)
  }
}
export function login(userToLogin) {
  return async dispatch => {
    const user = await userService.login(userToLogin)
    if (!user) return
    console.log('user:', user)
    userService.storage.saveUserToStorage(user)
    const action = { type: 'LOAD_USER', user }
    dispatch(action)
  }
}
export function logout() {
  return async dispatch => {
    await userService.logout()
    userService.storage.saveUserToStorage(null)
    const action = { type: 'LOAD_USER', user: null }
    dispatch(action)
  }
}