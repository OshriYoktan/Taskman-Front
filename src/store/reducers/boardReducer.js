const INITIAL_STATE = {
  boards: [],
  currBoard: null,
  background: false,
  setBackground: null,
  filterBy: null,
}

export function boardReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_BOARDS':
      return {
        ...state,
        boards: action.boards
      }
    case 'SET_BOARD':
      return {
        ...state,
        currBoard: action.board
      }
    case 'ADD_BOARD':
      return {
        ...state,
        boards: [...state.boards, action.board]
      }
    case 'REMOVE_BOARD':
      return {
        ...state,
        boards: state.boards.filter(board => board._id !== action.boardId)
      }
    case 'UPDATE_BOARD':
      const { updatedBoard } = action
      return {
        ...state,
        boards: state.boards.map(board => board._id === updatedBoard._id ? updatedBoard : board)
      }
    case 'UPDATE_BACKGROUND':
      return {
        ...state,
        background: action.background
      }
    case 'UPDATE_FILTERBY':
      return {
        ...state,
        filterBy: action.filterBy
      }
    default:
      return state
  }
}