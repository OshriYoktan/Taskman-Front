import { useEffect } from 'react';
import { WidgetLoader } from 'react-cloudinary-upload-widget';
import { useDispatch, useSelector } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import { AppHeader } from './cmps/AppHeader';
import { BoardDetails } from './pages/BoardDetails';
import { LandingPage } from './pages/LandingPage';
import { TaskmanApp } from './pages/TaskmanApp';
import userService from './services/userService';
import { loadBoards, setCurrBackground } from './store/actions/boardActions';
import { loadUsers, login } from './store/actions/userActions';
import backgroundImg from './assets/imgs/home-img.jpg'

function App() {
    const dispatch = useDispatch()
    const currBoard = useSelector(state => state.boardReducer.currBoard)
    const background = useSelector(state => state.boardReducer.background)
    const currBackground = useSelector(state => state.boardReducer.currBackground)
    const loggedinUser = userService.storage.loadUserFromStorage()

    useEffect(() => {
        dispatch(loadUsers())
        dispatch(loadBoards())
    }, [])

    useEffect(() => {
        dispatch(setCurrBackground(null))
    }, [background])

    useEffect(() => {
        if (loggedinUser) {
            dispatch(login(loggedinUser))
        }
    }, [currBoard])

    return (
        <Router>
            <div className="App container" style={!background ? currBoard ? currBoard.background.color ? { backgroundColor: currBackground } : { backgroundImage: currBoard.background.img ? `url(${currBackground})` : '' } : { backgroundColor: 'white' } : { backgroundImage: `url(${backgroundImg})` }}>
                <AppHeader />
                <WidgetLoader />
                <Switch>
                    <Route component={BoardDetails} path='/board/:id?' />
                    <Route component={TaskmanApp} path='/boards' />
                    <Route component={LandingPage} path='/' />
                </Switch>
            </div>
        </Router>
    );
}

export default App;