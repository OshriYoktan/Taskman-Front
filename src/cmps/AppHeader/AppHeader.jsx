import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import './AppHeader.scss'
import { useDispatch } from 'react-redux'
import { setCurrBoard } from '../../store/actions/boardActions'
import { UserProfile } from '../UserProfile'
import { useEffect, useState } from 'react'
import { login } from '../../store/actions/userActions'
import userService from '../../services/userService'

export function AppHeader() {
    const dispatch = useDispatch()
    const [isProfile, setIsProfile] = useState(false)
    const [loggedinUser, setLoggedinUser] = useState(userService.storage.loadUserFromStorage())

    useEffect(() => {
        if (loggedinUser) dispatch(login(loggedinUser))
    }, [])

    const profileOp = {
        setIsProfile,
        isProfile
    }

    return (
        <>
            <nav className="app-header sub-container">
                <Link className="link" to="/boards" ><FontAwesomeIcon icon={faHome} /></Link>
                <Link className="link" to="/boards" >Taskman</Link>
                <button className="link" onClick={() => setIsProfile(!isProfile)} ><FontAwesomeIcon icon={faUserCircle} /></button>
            </nav>
            {isProfile && <UserProfile profileOp={profileOp} />}
        </>
    )
}
