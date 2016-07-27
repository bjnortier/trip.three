'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
const reactRender = ReactDOM.render;
import { Provider } from 'react-redux';
import App from './components/App';

const tripdom = require('trip.dom');
const $ = tripdom.$;
const DOMView = tripdom.View;

class SnapControlsReactView extends DOMView {

  constructor(model, scene, options) {
    super(model, scene, options);
  }

  render() {
    reactRender(
      <Provider store={this.model.store}>
        <App />
      </Provider>,
      $(this.scene.container)[0]
    );
  }

  update() {
    this.render();
  }

}

module.exports = SnapControlsReactView;
