import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BoardPreview } from '../BoardPreview'
import './BoardList.scss'

export function BoardList({ boardListOp }) {
    const { register, handleSubmit, reset } = useForm();
    const [isCreateBoard, setIsCreateBoard] = useState(null)

    const onAddBoard = data => {
        boardListOp.addBoard(data.newBoardTitle)
        setIsCreateBoard(!isCreateBoard)
        reset()
    }

    return (
        <ul className="board-container">
            {console.log(boardListOp.boards)}
            {boardListOp.boards.map(board => <li key={board._id}><BoardPreview key={board._id} board={board} /></li>)}
            <li className="board-link add-board">
                {!isCreateBoard && <button onClick={() => setIsCreateBoard(!isCreateBoard)}>Create board</button>}
                {isCreateBoard &&
                    <form onSubmit={handleSubmit(onAddBoard)}>
                        <input type="text" id="title" name="title" autoComplete="off" {...register("newBoardTitle")} placeholder="Board name" />
                        <button>Create board</button>
                    </form>}
            </li>
        </ul>
    )
}