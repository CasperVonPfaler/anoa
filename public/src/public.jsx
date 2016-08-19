import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Channel from './components/channel/channel.jsx';
import Pages from './components/pages/pages.jsx';
import Home from './components/pages/home/home.jsx';
import New from './components/pages/new/new.jsx';
import About from './components/pages/about/about.jsx';

function Root() {
  return (
    <Router history={browserHistory} >
      <Route path="/channel/:id" component={Channel} />
      <Route path="/" component={Pages} >
        <IndexRoute component={Home} />
        <Route path="new" component={New} />
        <Route path="about" component={About} />
      </Route>
    </Router>
  );
}

ReactDom.render(<Root />, document.getElementById('root'));
