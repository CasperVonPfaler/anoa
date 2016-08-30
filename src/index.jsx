import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import ChannelContainer from './components/pages/channel/channel.container';
import Pages from './components/pages/pages.jsx';
import HomeContainer from './components/pages/home/home.container';
import About from './components/pages/about/about.jsx';

import * as homeReducers from './components/pages/home/home.reducer';
import * as channelReducers from './components/pages/channel/channel.reducer';
import * as databaseReducers from './database/database.reducer';
import * as navReducers from './components/pages/nav/nav.reducer'

require('./index.css');
require('./utils/night-mode.css');

const reducer = combineReducers(
  Object.assign(
    {},
    homeReducers,
    channelReducers,
    databaseReducers,
    navReducers
  )
);

const store = createStore(
  reducer,
  applyMiddleware(
    thunk
  )
);

function Root() {
  return (
    <Provider store={store} >
      <Router history={browserHistory} >
        <Route path="/" component={Pages} >
          <IndexRoute component={HomeContainer} />
          <Route path="about" component={About} />
          <Route path="/channel/:id" component={ChannelContainer} />
        </Route>
      </Router>
    </Provider>
  );
}

ReactDom.render(<Root />, document.getElementById('root')); //eslint-disable-line
