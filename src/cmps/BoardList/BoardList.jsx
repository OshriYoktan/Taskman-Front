import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BoardPreview } from '../BoardPreview'
import './BoardList.scss'

export function BoardList({ boardListOp }) {
    const { register, handleSubmit } = useForm();
    const [isCreateBoard, setIsCreateBoard] = useState(null)

    const onAddBoard = data => {
        boardListOp.addBoard(data.newBoardTitle)
        setIsCreateBoard(!isCreateBoard)
    }

    return (
        <ul className="board-container">
            {boardListOp.boards.map(board => <li key={board._id}><BoardPreview board={board}></BoardPreview></li>)}
            <li className="board-link add-board">
                {!isCreateBoard && <button onClick={() => setIsCreateBoard(!isCreateBoard)}>Create board</button>}
                {isCreateBoard &&
                    <form onSubmit={handleSubmit(onAddBoard)}>
                        <input type="text" id="title" name="title" {...register("newBoardTitle")} placeholder="Board name" />
                        <h4>Create board</h4>
                    </form>}
            </li>
        </ul>
    )
}