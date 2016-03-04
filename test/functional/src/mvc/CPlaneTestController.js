'use strict';

const tripcore = require('trip.core');
const tripdom = require('trip.dom');
const $ = tripdom.$;

const lib = require('../../../..');

const CubeView = require('./CubeView');

class CPlaneTestController extends tripcore.Controller {

  constructor() {
    super(new tripcore.Model());

    var threeJSScene = new lib.Scene($('#viewport'), {
      distance: 5,
      elevation: Math.PI/4,
      azimuth: -Math.PI/4,
      near: 0.1,
      far: 100,
    });

    new lib.CPlaneController(
      threeJSScene,
      new tripdom.Scene($('#cplane-controls')));

    this.addView(threeJSScene, CubeView, {
      label: 'c1',
    });
    this.addView(threeJSScene, CubeView, {
      label: 'c2',
      color: 0xff6666,
      position: {x: 0.6, y: 0, z: 0},
      size: 0.2
    });
  }

}

module.exports = CPlaneTestController;
