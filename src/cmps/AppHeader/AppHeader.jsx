import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import './AppHeader.scss'

export function AppHeader() {
    return (
        <nav className="app-header sub-container">
            <Link className="link" to="/boards"><FontAwesomeIcon icon={faHome} /></Link>
            <Link className="link" to="/boards">Taskman</Link>
            <Link className="link" to="/boards"><FontAwesomeIcon icon={faUserCircle} /></Link>
        </nav>
    )
}
