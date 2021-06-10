import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from '../../store/actions/userActions'
import './UserProfile.scss'

export function UserProfile({ profileOp }) {
    const { isProfile, setIsProfile } = profileOp
    const dispatch = useDispatch()
    const user = useSelector(state => state.userReducer.user)
    const { register, handleSubmit, reset } = useForm();

    const closeMenu = () => setIsProfile(false)

    const onLogin = async data => {
        try {
            const userToLogin = { username: data.loginUsername, password: data.loginPass }
            dispatch(login(userToLogin))
            setIsProfile(true)
            reset()
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
                    <p>{user.username}</p>
                    <p>{user.tasks.length ? 'Tasks:' : 'No tasks assigned.'}</p>
                </div>
                <div>
                    <ul>
                        {!user.tasks.length ? null : user.tasks.map((task, idx) => <li key={idx}>{task}</li>)}
                        {!user.tasks.length ? null : <li>{user.tasks.length} tasks.</li>}
                        {user.tasks ? null : <li>{user.tasks.length}</li>}
                    </ul>
                </div>
                <div>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </section>}
            {
                !user && <section>
                    <div>
                        <h3>Login</h3>
                    </div>
                    <form onSubmit={handleSubmit(onLogin)}>
                        <input type="text" autoComplete="off" placeholder="username" {...register("loginUsername")} />
                        <input type="password" autoComplete="off" placeholder="password" {...register("loginPass")} />
                        <button>Login</button>
                    </form>
                </section>
            }
        </>
    )
}