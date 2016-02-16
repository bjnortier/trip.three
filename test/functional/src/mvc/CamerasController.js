var trip = require('../../../..');
var $ = trip.$;
var DOMScene = trip.scenes.DOMScene;
var ThreeJSScene = trip.scenes.ThreeJSScene;
var Controller = trip.Controller;

var CubeView = require('./CubeView');
var CameraSelectView = require('./CameraSelectView');

class EventCaptureController extends Controller {

  constructor() {
    super(new trip.Model());

    var domScene = new DOMScene($('#dom'));
    this.addView(domScene, CameraSelectView);

    var threeJSSceneOptions = {
      cameraPosition: {
        x: 0, y: -7.5, z: 2.5
      }
    };
    var threeJSScene = new ThreeJSScene($('#viewport'), threeJSSceneOptions);
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
