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

    var threeJSSceneOptions = {
      cameraPosition: {
        x: 0, y: -7.5, z: 2.5
      }
    };
    var threeJSScene = new lib.Scene($('#viewport'), threeJSSceneOptions);
    this.addView(threeJSScene, CubeView, {
      color: 0xff0000,
      position: {x: -2.5, y: 0, z: 0},
    });
    this.addView(threeJSScene, CubeView, {
      color: 0x00ff00,
      position: {x: 0, y: 0, z: 1},
    });
    this.addView(threeJSScene, CubeView, {
      color: 0x0000ff,
      position: {x: 2.5, y: 0, z: 0},
    });
  }


}

module.exports = EventCaptureController;
