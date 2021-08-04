import { Link } from 'react-router-dom'
import './BoardPreview.scss'
import { useDispatch } from 'react-redux';
import { setCurrBoard } from '../../store/actions/boardActions';

export function BoardPreview({ board }) {
    const dispatch = useDispatch()

    const LinkPrev = () => (<Link className="link" style={{ color: 'black' }} to={`/board/${board._id}`}>
        <h4>{board.title}</h4>
    </Link>)

    return (
        <div className="board-link links" key={board._id} onClick={() => dispatch(setCurrBoard(board._id))} style={board.background ? board.background.img ? { backgroundImage: `url(${board.background.img})` } : { backgroundColor: board.background.color } : { backgroundColor: 'white' }}>
            {board.background ? board.background.img ? <Link className="link" to={`/board/${board._id}`}>
                <h4 >{board.title}</h4>
            </Link> : <LinkPrev /> : <LinkPrev />}
        </div>
    )
}