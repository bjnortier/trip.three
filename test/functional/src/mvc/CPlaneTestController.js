'use strict';

const tripcore = require('trip.core');
const tripdom = require('trip.dom');
const $ = tripdom.$;

const lib = require('../../../..');

const CPlaneTestModel = require('./models/CPlaneTestModel');
const CubeView = require('./CubeView');
const CoordinatesDOMView = require('./views/CoordinatesDOMView');

class CPlaneTestController extends tripcore.Controller {

  constructor() {
    super(new CPlaneTestModel());

    let valuesDOMScene = new tripdom.Scene($('#values'));
    let threeJSScene = new lib.Scene($('#viewport'), {
      distance: 5,
      elevation: Math.PI/4,
      azimuth: -Math.PI/4,
      near: 0.1,
      far: 100,
    });

    let ctrl = new lib.CPlaneController(
      threeJSScene,
      new tripdom.Scene($('#cplane-controls')));
    ctrl.on('mousemove', (event, position) => {
      this.model.setMouseMove(position);
    });
    ctrl.on('click', (event, position) => {
      this.model.setClick(position);
    });

    this.addView(threeJSScene, CubeView, {
      label: 'c1',
    });
    this.addView(threeJSScene, CubeView, {
      label: 'c2',
      color: 0xff6666,
      position: {x: 0.6, y: 0, z: 0},
      size: 0.2
    });
    this.addView(valuesDOMScene, CoordinatesDOMView, {
      label: 'mousemove',
      field: 'mouseMove',
    });
    this.addView(valuesDOMScene, CoordinatesDOMView, {
      label: 'click',
      field: 'click',
    });
  }

}

module.exports = CPlaneTestController;
