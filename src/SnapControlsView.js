'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const reactRender = ReactDOM.render;
const Provider = require('react-redux').Provider;
const SnapControlsContainer = require('./containers/SnapControlsContainer');

const tripdom = require('trip.dom');
const DOMView = tripdom.View;

class SnapControlsView extends DOMView {

  constructor(model, scene, options) {
    super(model, scene, options);
  }

  render() {
    super.render();
    reactRender(
      <Provider store={this.model.store}>
        <SnapControlsContainer/>
      </Provider>,
      this.$el[0]
    );
  }

  update() {
    this.render();
  }

}

module.exports = SnapControlsView;
