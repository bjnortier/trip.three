'use strict';

const tripcore = require('trip.core');
const tripdom = require('trip.dom');
const $ = tripdom.$;

const lib = require('../../../../..');
const SnapController = lib.SnapController;

const SnapTestModel = require('../models/SnapTestModel');
const CubeView = require('../views/CubeView');
const CoordinateDOMView = require('../views/CoordinateDOMView');
const Coordinate3View = require('../views/Coordinate3View');
const CameraSelectView = require('../views/CameraSelectView');

class CPlaneTestController extends tripcore.Controller {

  constructor() {
    super(new SnapTestModel());

    const domScene = new tripdom.Scene($('#cameras'));
    this.addView(domScene, CameraSelectView);

    const valuesDOMScene = new tripdom.Scene($('#values'));
    const threeJSScene = new lib.Scene($('#viewport'), {
      distance: 5,
      elevation: Math.PI/4,
      azimuth: -Math.PI/4,
      near: 0.1,
      far: 100,
      layers: 2,
    });
    this.scene = threeJSScene;

    const viewFilterForSurfaceSnap = (view) => {
      return view.layer === 0;
    };
    const ctrl = new SnapController(
      threeJSScene,
      new tripdom.Scene($('#snap-controls')),
      {
        viewFilterForSurfaceSnap: viewFilterForSurfaceSnap,
        extents: 30,
      });
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

    this.addView(valuesDOMScene, CoordinateDOMView, {
      label: 'mousemove',
      field: 'mouseMove',
    });
    this.addView(valuesDOMScene, CoordinateDOMView, {
      label: 'click',
      field: 'click',
    });
    this.addView(threeJSScene, Coordinate3View, {
      color: 0xff0000,
      field: 'mouseMove',
    });
    this.addView(threeJSScene, Coordinate3View, {
      color: 0x00ff00,
      field: 'click',
    });
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

}

module.exports = CPlaneTestController;
