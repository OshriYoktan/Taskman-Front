import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadBoards, saveBoard, setCurrBoard, updateBackground } from '../../store/actions/boardActions.js'
import { BoardList } from '../../cmps/BoardList'
import './TaskmanApp.scss'
import boardService from '../../services/boardService.js'
import loader from '../../assets/imgs/taskman-loader.svg'
import { socketService } from '../../services/socketService.js'

export function TaskmanApp() {
    const dispatch = useDispatch()
    const boards = useSelector(state => state.boardReducer.boards)

    useEffect(() => {
        socketService.setup();
        dispatch(setCurrBoard(null))
        dispatch(loadBoards())
        dispatch(updateBackground(true))
    }, [dispatch])

    const addBoard = async (title) => {
        const newBoard = boardService.getEmptyBoard()
        newBoard.title = title
        await dispatch(saveBoard(newBoard))
        boards.push(newBoard)
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