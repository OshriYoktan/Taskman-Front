import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadBoards, saveBoard, updateBackground } from '../../store/actions/boardActions.js'
import { BoardList } from '../../cmps/BoardList'
import './TaskmanApp.scss'
import boardService from '../../services/boardService.js'
import loader from '../../assets/imgs/taskman-loader.svg'
import { socketService } from '../../services/socketService.js'

export function TaskmanApp() {
    const dispatch = useDispatch()
    const boards = useSelector(state => state.boardReducer.boards)
    const newBoard = boardService.getEmptyBoard()

    useEffect(() => {
        socketService.setup();
        dispatch(loadBoards())
        dispatch(updateBackground(true))
    }, [])

    const addBoard = (title) => {
        newBoard.title = title
        dispatch(saveBoard(newBoard))
        dispatch(loadBoards())
    }

    if (!boards || !boards.length) return (<div className="loader-container"><img src={loader} alt="" /></div>)

    const boardListOp = {
        boards,
        addBoard
    }

    return (
        <div className="sub-container taskman-container">
            <h2>Your Workspace boards</h2>
            <BoardList boardListOp={boardListOp}></BoardList>
        </div >
    )
}
