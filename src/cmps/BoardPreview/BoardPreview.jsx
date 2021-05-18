import { Link } from 'react-router-dom'
import './BoardPreview.scss'

export function BoardPreview({ board }) {
    console.log('board:', board)

    return (
        <div className="board-link links" style={board.background.img ? { backgroundImage: `url(${board.background.img})` } : { backgroundColor: board.background.color }}>
            <Link className="link" to={`/board/${board._id}`}>
                <h4>{board.title}</h4>
            </Link>
        </div>
    )
}