import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import './AppHeader.scss'
import { useDispatch } from 'react-redux'
import { updateBackground } from '../../store/actions/boardActions'

export function AppHeader() {
    const dispatch = useDispatch()

    return (
        <nav className="app-header sub-container">
            <Link className="link" onClick={() => dispatch(updateBackground(true))} to="/"><FontAwesomeIcon icon={faHome} /></Link>
            <Link className="link" onClick={() => dispatch(updateBackground(true))} to="/">Taskman</Link>
            <Link className="link" onClick={() => dispatch(updateBackground(true))} to="/"><FontAwesomeIcon icon={faUserCircle} /></Link>
        </nav>
    )
}
