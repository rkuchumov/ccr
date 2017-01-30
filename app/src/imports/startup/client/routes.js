
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import Monitor from '../../ui/pages/Monitor.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Monitor} />
    <Route path="/monitor" component={Monitor} />
  </Router>
);
