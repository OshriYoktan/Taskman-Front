import { useSelector } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import { AppHeader } from './cmps/AppHeader';
import { BoardDetails } from './pages/BoardDetails';
import { TaskmanApp } from './pages/TaskmanApp';

function App() {
  const background = useSelector(state => state.boardReducer.background)
  const currBoard = useSelector(state => state.boardReducer.currBoard)
  return (
    <Router>
      <div className="App container" style={!background ? currBoard ? currBoard.background.color ? { backgroundColor: currBoard.background.color } : { backgroundImage: currBoard.background.img ? `url(${currBoard.background.img})` : '' } : { backgroundColor: 'white' } : { backgroundColor: 'white' }}>
        <AppHeader />
        <Switch>
          <Route component={BoardDetails} path='/board/:id?' />
          <Route component={TaskmanApp} path='/' />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
