const tripcore = require('trip.core');
const tripdom = require('trip.dom');
const $ = tripdom.$;

const lib = require('../../../..');

var CubeView = require('./CubeView');
var CameraSelectView = require('./CameraSelectView');

class CamerasController extends tripcore.Controller {

  constructor() {
    super(new tripcore.Model());

    var domScene = new tripdom.Scene($('#dom'));
    this.addView(domScene, CameraSelectView);

    var options = {
      cameraPosition: {
        x: 0, y: -7.5, z: 2.5
      }
    };
    var scene = new lib.Scene($('#viewport'), options);
    this.addView(scene, CubeView, {
      color: 0xff0000,
      position: {x: -2.5, y: 0, z: 0},
    });
    this.addView(scene, CubeView, {
      color: 0x00ff00,
      position: {x: 0, y: 0, z: 1},
    });
    this.addView(scene, CubeView, {
      color: 0x0000ff,
      position: {x: 2.5, y: 0, z: 0},
    });
    this.scene = scene;
  }

  clickPerspective() {
    this.scene.setPerspective();
    this.model.mode = 'perspective';
    this.model.orthoModel = null;
  }

  clickZAxis() {
    if ((this.model.mode === 'orthographic') && (this.model.orthoMode === 'z+')) {
      this.scene.setOrthoZNeg();
      this.model.orthoMode = 'z-';
    } else {
      this.scene.setOrthoZPos();
      this.model.orthoMode = 'z+';
    }
    this.model.mode = 'orthographic';
  }

  clickYAxis() {
    if ((this.model.mode === 'orthographic') && (this.model.orthoMode === 'y+')) {
      this.scene.setOrthoYNeg();
      this.model.orthoMode = 'y-';
    } else {
      this.scene.setOrthoYPos();
      this.model.orthoMode = 'y+';
    }
    this.model.mode = 'orthographic';
  }

  clickXAxis() {
    if ((this.model.mode === 'orthographic') && (this.model.orthoMode === 'x+')) {
      this.scene.setOrthoXNeg();
      this.model.orthoMode = 'x-';
    } else {
      this.scene.setOrthoXPos();
      this.model.orthoMode = 'x+';
    }
    this.model.mode = 'orthographic';
  }

}

module.exports = CamerasController;
