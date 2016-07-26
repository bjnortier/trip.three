'use strict';
new (require('./mvc/controllers/SnapTestController'))();

import React from 'react';
import { render } from 'react-dom';
// import { Provider } from 'react-redux';
import { createStore } from 'redux';
// import todoApp from './reducers';
import App2 from './components/App2';

import snap from './reducers/snap';

// let store = createStore(todoApp);
const store2 = createStore(snap);

const onSnapClick = (key) => {
  store2.dispatch({
    type: 'TOGGLE_SNAP',
    key,
  });
};

const render2 = () => {
  render(
    <App2
      store={store2}
      onSnapClick={onSnapClick}
    />,
    document.getElementById('snap-controls-2')
  );
};

store2.subscribe(render2);
render2();
