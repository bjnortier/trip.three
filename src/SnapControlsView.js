'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const reactRender = ReactDOM.render;
const Provider = require('react-redux').Provider;
const App = require('./components/App');

const tripdom = require('trip.dom');
const $ = tripdom.$;
const DOMView = tripdom.View;

class SnapControlsView extends DOMView {

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

module.exports = SnapControlsView;
