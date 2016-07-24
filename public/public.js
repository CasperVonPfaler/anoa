// Load css styles for components
require('./util/util.css');
require('./login/login.css');
require('./channel/channel.css');
require('./channel/question/question.css');
require('./channel/question/answer/answer.css');

import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import Channel from './channel/channel';
import Login from './login/login';

function Root() {
  return (
    <Router history={browserHistory} >
      <Route path="/channel/:id" component={Channel} />
      <Route path="*" component={Login} />
    </Router>
  );
}

ReactDom.render(<Root />, document.getElementById('root'));
