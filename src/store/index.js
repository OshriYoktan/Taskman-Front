import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk'
import { boardReducer } from './reducers/boardReducer';
// import { userReducer } from './reducers/userReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const rootReducer = combineReducers({
  boardReducer,
  // userReducer
})

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))