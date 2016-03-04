'use strict';

const Controller = require('trip.core').Controller;
const tripdom = require('trip.dom');
const DOMScene = tripdom.Scene;
const $ = tripdom.$;

const CPlaneModel = require('./CPlaneModel');
const CPlaneControlsView = require('./CPlaneControlsView');
const CPlane3View = require('./CPlane3View');

class CPlaneController extends Controller {

  constructor(threeJSScene, controlsScene) {
    super(new CPlaneModel());

    var controlsScene = new DOMScene($('#cplane-controls'));
    this.addView(controlsScene, CPlaneControlsView);

    let threeView = this.addView(threeJSScene, CPlane3View, {layer: 0});
    threeView.on('mousemove', (event, position) => {
      this.emit('mousemove', event, position);
    });
    threeView.on('click', (event, position) => {
      this.emit('click', event, position);
    });
  }

  changeSize(event) {
    this.model.update('size', parseFloat($(event.currentTarget).val(), 10));
  }

  changeSnapGrid(event) {
    this.model.update('snapGrid', $(event.currentTarget).is(':checked'));
  }

  changeSnapCorners(event) {
    this.model.update('snapCorners', $(event.currentTarget).is(':checked'));
  }

  changeSnapEdges(event) {
    this.model.update('snapEdges', $(event.currentTarget).is(':checked'));
  }

}

module.exports = CPlaneController;
