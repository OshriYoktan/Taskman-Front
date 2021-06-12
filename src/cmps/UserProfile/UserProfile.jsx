import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout, signup } from '../../store/actions/userActions'
import loader from '../../assets/imgs/taskman-loader.svg'
import './UserProfile.scss'

export function UserProfile({ profileOp }) {
    const { isProfile, setIsProfile } = profileOp
    const dispatch = useDispatch()
    const user = useSelector(state => state.userReducer.user)
    const { register, handleSubmit, reset } = useForm();
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [errMsg, setErrMsg] = useState(null)

    const closeMenu = () => setIsProfile(false)

    const onLogin = async data => {
        setErrMsg(null)
        setIsLoading(true)
        const userToLogin = { username: data.loginUsername, password: data.loginPass }
        const isLoggedin = await dispatch(login(userToLogin))
        if (isLoggedin) setErrMsg(isLoggedin)
        setIsLoading(false)
        reset()
    }

    const onSignup = async data => {
        setErrMsg(null)
        setIsLoading(true)
        const userToSignup = { name: data.loginFullname, username: data.loginUsername, password: data.loginPass, tasks: [] }
        const isSignup = await dispatch(signup(userToSignup))
        setIsLoading(false)
        if (isSignup) setErrMsg(isSignup)
        setIsProfile(true)
        reset()
    }

    const onLogout = () => {
        dispatch(logout())
        setIsProfile(false)
    }

    if (isLoading) return (<div className="profile-loader login-form"><img src={loader} alt="" /></div>)

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
            {!user && <section className="login-form">
                <h3>{isLogin ? 'Login' : 'Signup'}</h3>
                {isLogin && <form onSubmit={handleSubmit(onLogin)}>
                    <input type="text" autoComplete="off" placeholder="username" {...register("loginUsername")} />
                    <input type="password" autoComplete="off" placeholder="password" {...register("loginPass")} />
                    <button>Login</button>
                </form>}
                {!isLogin && <form onSubmit={handleSubmit(onSignup)}>
                    <input type="text" autoComplete="off" placeholder="fullname" {...register("loginFullname")} />
                    <input type="text" autoComplete="off" placeholder="username" {...register("loginUsername")} />
                    <input type="password" autoComplete="off" placeholder="password" {...register("loginPass")} />
                    {errMsg && <p>{errMsg}</p>}
                    <button>Signup</button>
                </form>}
                {isLogin && <p onClick={() => setIsLogin(!isLogin)}>Not a registered user?<br />Click here to sign-up.</p>}
                {!isLogin && <p onClick={() => setIsLogin(!isLogin)}>Registered user?<br />Click here to login.</p>}
            </section>}
        </>
    )
}