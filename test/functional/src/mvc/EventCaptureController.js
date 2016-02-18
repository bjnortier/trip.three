const tripcore = require('trip.core');
const tripdom = require('trip.dom');
const $ = tripdom.$;

const lib = require('../../../..');
// const AxesView = trip.AxesView;

const EventCaptureModel = require('./EventCaptureModel');
const EventCaptureView = require('./EventCaptureView');
const CubeView = require('./CubeView');

class EventCaptureController extends tripcore.Controller {

  constructor() {
    super(new EventCaptureModel());

    var domScene = new tripdom.Scene($('#dom'));
    this.addView(domScene, EventCaptureView);

    var threeJSSceneOptions = {
      cameraPosition: {
        x: 1, y: 2, z: 1
      }
    };
    var threeJSScene = new lib.Scene($('#viewport'), threeJSSceneOptions);
    this.addView(threeJSScene, CubeView, {
      label: 'c1',
    });
    this.addView(threeJSScene, CubeView, {
      label: 'c2',
      color: 0xff6666,
      position: {x: 0.6, y: 0, z: 0},
      size: 0.2
    });
    // this.addView(threeJSScene, AxesView);
  }

  threeJSViewClick(event, view, data) {
    this.model.addEvent('click:' + view.label, event, data);
  }

  threeJSViewMouseEnter(event, view, data) {
    this.model.addEvent('enter:' + view.label, event, data);
  }

  threeJSViewMouseLeave(event, view, data) {
    this.model.addEvent('leave:' + view.label, event, data);
  }

  threeJSViewMouseOver(event, view, data) {
    this.model.addEvent('over:' + view.label, event, data);
  }

}

module.exports = EventCaptureController;