import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import './AppHeader.scss'
import { useDispatch } from 'react-redux'
import { UserProfile } from '../UserProfile'
import { useEffect, useState } from 'react'
import { login } from '../../store/actions/userActions'
import userService from '../../services/userService'
import logo from '../../assets/imgs/Taskman-logo.png'

export function AppHeader() {
    const dispatch = useDispatch()
    const [isProfile, setIsProfile] = useState(false)
    const loggedinUser = userService.storage.loadUserFromStorage()

    useEffect(() => {
        if (loggedinUser) dispatch(login(loggedinUser))
    }, [])

    const profileOp = {
        setIsProfile,
        isProfile
    }

    return (
        <>
            <nav className="app-header sub-container" style={window.location.hash.includes('boards') ? { backgroundColor: '#026AA7', position: 'sticky', top: 0, zIndex: 20 } : { backgroundColor: 'rgba(0, 0, 0, 0.32)' }}>
                <Link className="link" to="/boards" ><FontAwesomeIcon icon={faHome} /></Link>
                <Link className="link" to="/boards" ><img src={logo} alt={logo} /> Task<span>man</span></Link>
                <button className="link" onClick={() => setIsProfile(!isProfile)} ><FontAwesomeIcon icon={faUserCircle} /></button>
            </nav>
            <UserProfile profileOp={profileOp} />
        </>
    )
}
