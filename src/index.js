import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import App from './components/App/App';

import rootSaga from './redux/sagas/sagaIndex';
import rootReducer from './redux/reducers/reducersIndex';

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();
// Pass rootSaga into our sagaMiddleware

const middlewareList = process.env.NODE_ENV === 'development'
  ? [sagaMiddleware, logger]
  : [sagaMiddleware];

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middlewareList),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
window.store = store;

sagaMiddleware.run(rootSaga);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('react-root'));
