import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import './AppHeader.scss'
import { useDispatch } from 'react-redux'
import { setCurrBoard } from '../../store/actions/boardActions'

export function AppHeader() {
    const dispatch = useDispatch()

    return (
        <nav className="app-header sub-container">
            <Link className="link" to="/boards" onClick={() => dispatch(setCurrBoard(null))} ><FontAwesomeIcon icon={faHome} /></Link>
            <Link className="link" to="/boards" onClick={() => dispatch(setCurrBoard(null))} >Taskman</Link>
            <Link className="link" to="/boards" onClick={() => dispatch(setCurrBoard(null))} ><FontAwesomeIcon icon={faUserCircle} /></Link>
        </nav>
    )
}
