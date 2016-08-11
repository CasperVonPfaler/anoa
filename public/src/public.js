require('./common/common.css');
require('./components/login/login.css');
require('./components/channel/channel.css');
require('./components/channel/question/question.css');
require('./components/channel/question/answer/answer.css');

import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import Channel from './components/channel/channel';
import Login from './components/login/login';

function Root() {
  return (
    <Router history={browserHistory} >
      <Route path="/channel/:id" component={Channel} />
      <Route path="*" component={Login} />
    </Router>
  );
}

ReactDom.render(<Root />, document.getElementById('root'));
