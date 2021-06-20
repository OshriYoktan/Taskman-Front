import { Link } from 'react-router-dom'
import './BoardPreview.scss'
import Color from 'color-thief-react';
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
                <Color src={board.background.img} crossOrigin="anonymous" format="hex">
                    {({ data, loading }) => {
                        if (loading) return <div className="preview-loader">...</div>;
                        return <h4 style={{ color: data }}>{board.title}</h4>
                    }}
                </Color>
            </Link> : <LinkPrev /> : <LinkPrev />}
        </div>
    )
}