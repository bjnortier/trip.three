'use strict';
new (require('./mvc/controllers/SnapTestController'))();

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import snap from './reducers/snap';
import App from './components/App2';

let store = createStore(snap);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('snap-controls-2')
);
