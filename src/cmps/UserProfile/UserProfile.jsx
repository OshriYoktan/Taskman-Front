import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import userService from '../../services/userService'
import { login, logout } from '../../store/actions/userActions'
import './UserProfile.scss'

export function UserProfile({ profileOp }) {
    const { isProfile, setIsProfile } = profileOp
    const dispatch = useDispatch()
    const [loggedinUser, setLoggedinUser] = useState(userService.storage.loadUserFromStorage())
    const user = useSelector(state => state.userReducer.user)
    const { register, handleSubmit, reset } = useForm();

    const closeMenu = () => setIsProfile(false)

    useEffect(() => {
        if (loggedinUser) dispatch(login(loggedinUser))
    }, [])

    const onLogin = async data => {
        try {
            const userToLogin = { username: data.loginUsername, password: data.loginPass }
            dispatch(login(userToLogin))
            setIsProfile(true)
        } catch (err) {
            console.log('err:', err)
        }
    }

    const onLogout = async () => {
        try {
            dispatch(logout())
        } catch (err) {
            console.log('err:', err)
        }
    }

    return (
        <>
            {user && <section className="user-menu" style={isProfile ? { maxWidth: '100%' } : { maxWidth: '0' }}>
                <div>
                    <h3>Profile</h3>
                    <p onClick={closeMenu}><FontAwesomeIcon className="fa" icon={faTimes} /></p>
                </div>
                <div>
                    <p>Aviv Zohar</p>
                    <p>Tasks: 5</p>
                </div>
                <div>
                    <ul>
                        <li>Task</li>
                        <li>Task</li>
                    </ul>
                </div>
                <div>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </section>}
            {!user && <section>
                <div>
                    <h3>Login</h3>
                </div>
                <form onSubmit={handleSubmit(onLogin)}>
                    <input type="text" autoComplete="off" placeholder="Search for task..." {...register("loginUsername")} />
                    <input type="text" autoComplete="off" placeholder="Search for task..." {...register("loginPass")} />
                    <button>Login</button>
                </form>
            </section>}
        </>
    )
}