import boardService from '../../services/boardService'

export function loadBoards(filterBy) {
  return async dispatch => {
    const boards = await boardService.query(filterBy)
    const action = { type: 'SET_BOARDS', boards }
    dispatch(action)
  }
}
export function getBoardById(boardId) {
  return async dispatch => {
    const board = await boardService.getBoardById(boardId)
    await dispatch({ type: 'SET_BOARD', board })
    return board
  }
}
export function saveBoard(board) {
  return async dispatch => {
    const updatedBoard = await boardService.saveBoard(board)
    if (!board._id) return dispatch({ type: 'ADD_BOARD', board: updatedBoard })
    else return dispatch({ type: 'UPDATE_BOARD', updatedBoard })
  }
}
export function setCurrBoard(boardId) {
  return async dispatch => {
    var board = null
    if (boardId) board = await boardService.getBoardById(boardId)
    dispatch({ type: 'SET_BOARD', board })
  }
}
export function removeBoard(boardId) {
  return async dispatch => {
    const res = await boardService.deleteBoard(boardId)
    if (!res) return
    dispatch({ type: 'REMOVE_BOARD', boardId })
    return res.msg;
  }
}
export function updateBackground(background) {
  return async dispatch => {
    await dispatch({ type: 'UPDATE_BACKGROUND', background })
  }
}
export function updateFilterBy(filterBy) {
  return async dispatch => {
    await dispatch({ type: 'UPDATE_FILTERBY', filterBy })
  }
}