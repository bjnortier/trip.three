const tripcore = require('trip.core');
const tripdom = require('trip.dom');
const $ = tripdom.$;

const lib = require('../../../..');

var CubeView = require('./CubeView');
var CameraSelectView = require('./CameraSelectView');

class EventCaptureController extends tripcore.Controller {

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

  toPerspective() {
    this.scene.switchToPerspective();
  }

  toZAxis() {
    this.scene.switchToTopBottom();
  }


}

module.exports = EventCaptureController;
