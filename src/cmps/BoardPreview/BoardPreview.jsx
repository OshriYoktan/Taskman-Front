import { Link } from 'react-router-dom'
import './BoardPreview.scss'
import Color from 'color-thief-react';

export function BoardPreview({ board }) {


    return (
        <div className="board-link links" style={board.background.img ? { backgroundImage: `url(${board.background.img})` } : { backgroundColor: board.background.color }}>
            <Link className="link" to={`/board/${board._id}`}>
                <Color src={board.background.img} format="hex">
                    {({ data, loading, error }) => (
                        <h4 style={{ color: data }}>{board.title}</h4>
                    )}
                </Color>
            </Link>
        </div>
    )
    // return (
    //     <div className="board-link links" style={board.background.img ? { backgroundImage: `url(${board.background.img})` } : { backgroundColor: board.background.color }}>
    //         <Link className="link" to={`/board/${board._id}`}>
    //             <h4>{board.title}</h4>
    //         </Link>
    //     </div>
    // )
}