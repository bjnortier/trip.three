const tripcore = require('trip.core');
const tripdom = require('trip.dom');
const $ = tripdom.$;

const lib = require('../../../..');

var CubeView = require('./CubeView');
var AxesView = require('./AxesView');
var CameraSelectView = require('./CameraSelectView');

class CamerasController extends tripcore.Controller {

  constructor() {
    super(new tripcore.Model());

    var domScene = new tripdom.Scene($('#dom'));
    this.addView(domScene, CameraSelectView);

    var options = {
      distance: 10,
      azimuth: Math.PI/4,
      elevation: 1.08,
    };
    var scene = new lib.Scene($('#viewport'), options);
    this.addView(scene, CubeView, {
      color: 0xff0000,
      position: {x: 0, y: 0, z: 2.5},
    });
    this.addView(scene, CubeView, {
      color: 0x0000ff,
      position: {x: 2.5, y: 0, z: 0},
    });
    this.addView(scene, CubeView, {
      color: 0x6699ff,
      position: {x: -2.5, y: 0, z: 0},
    });
    this.addView(scene, CubeView, {
      color: 0x00ff00,
      position: {x: 0, y: 2.5, z: 0},
    });
    this.addView(scene, AxesView, {
      length: 5,
    });
    this.scene = scene;
  }

  perspective() {
    this.scene.setPerspective();
    this.model.mode = 'perspective';
    this.model.orthoModel = null;
  }

  'x+'() {
    this.scene.setOrthoXPos();
    this.model.mode = 'orthographic';
  }

  'x-'() {
    this.scene.setOrthoXNeg();
    this.model.mode = 'orthographic';
  }

  'y+'() {
    this.scene.setOrthoYPos();
    this.model.mode = 'orthographic';
  }

  'y-'() {
    this.scene.setOrthoYNeg();
    this.model.mode = 'orthographic';
  }

  'z+'() {
    this.scene.setOrthoZPos();
    this.model.mode = 'orthographic';
  }

  'z-'() {
    this.scene.setOrthoZNeg();
    this.model.mode = 'orthographic';
  }

  zoomToExtents() {
    this.scene.zoomToExtents();
  }

}

module.exports = CamerasController;
