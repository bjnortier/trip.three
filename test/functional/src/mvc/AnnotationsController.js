const trip = require('trip.core');
const tripdom = require('trip.dom');
const $ = tripdom.$;

const lib = require('../../..');
const Scene = lib.Scene;

const AxesView = lib.AxesView;
const CubeView = require('./CubeView');
const CornerAnnotationView = require('./CornerAnnotationView');

class AnnotationsController extends trip.Controller {

  constructor() {
    super(new trip.Model());

    var options = {
      cameraPosition: {
        x: 5, y: 5, z: 2,
      }
    };
    var scene = new Scene($('#viewport'), options);

    this.addView(scene, CubeView, {position: {x: 0.5, y: 0, z: 1.5}});
    this.addView(scene, CornerAnnotationView, {x: 0.0, y: 0.0, z: 0.0});
    this.addView(scene, CornerAnnotationView, {x: 1.0, y: 0.5, z: 1});
    this.addView(scene, CornerAnnotationView, {x: 0, y: -0.5, z: 2});
    this.addView(scene, AxesView);
  }

}

module.exports = AnnotationsController;
