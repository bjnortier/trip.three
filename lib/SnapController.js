'use strict';

const Controller = require('trip.core').Controller;
const tripdom = require('trip.dom');
const $ = tripdom.$;
const THREE = require('three');

const SnapModel = require('./SnapModel');
const SnapControlsView = require('./SnapControlsView');
const CPlane3View = require('./CPlane3View');

const toWorldPosition = require('./util/toWorldPosition');
const toScreenPosition = require('./util/toScreenPosition');
// const worldPositionToXY = require('./util/worldPositionToXY');
const worldPositionToPlane = require('./util/worldPositionToPlane');
const decimalAdjust = require('./util/decimalAdjust');
const closestPointToEdge = require('./util/closestPointToEdge');
const findClosestViewForScreenPosition = require('./util/findClosestViewForScreenPosition');

class SnapController extends Controller {

  constructor(threeJSScene, controlsScene, options) {
    options = options || {};
    super(new SnapModel(options));

    this.viewFilterForSurfaceSnap = options.viewFilterForSurfaceSnap;
    this.threeJSScene = threeJSScene;
    if (!options.hideControls) {
      this.addView(controlsScene, SnapControlsView);
    }

    const cplaneOptions = options.cplaneOptions || {};
    this.addView(threeJSScene, CPlane3View, cplaneOptions);

    threeJSScene.rawEventGenerator.on('mousemove', (event, screenPos) => {
      const worldPos = toWorldPosition(
        threeJSScene.width,
        threeJSScene.height,
        threeJSScene.camera,
        screenPos);
      const snapResult = this.snap(screenPos, worldPos);
      this.emit(
        'mousemove',
        event,
        snapResult.position,
        snapResult.view,
        snapResult.type,
        snapResult.object);
    });
    threeJSScene.rawEventGenerator.on('click', (event, screenPos) => {
      const worldPos = toWorldPosition(
        threeJSScene.width,
        threeJSScene.height,
        threeJSScene.camera,
        screenPos);
      const snapResult = this.snap(screenPos, worldPos);
      this.emit(
        'click',
        event,
        snapResult.position,
        snapResult.view,
        snapResult.type,
        snapResult.object);
    });
  }

  setXY() {
    this.model.update('orientation', 'XY');
  }

  setYZ() {
    this.model.update('orientation', 'YZ');
  }

  setZX() {
    this.model.update('orientation', 'ZX');
  }

  changeSize(event) {
    this.model.update('size', parseFloat($(event.currentTarget).val(), 10));
  }

  changeSnapGrid(event) {
    this.model.update('snapGrid', $(event.currentTarget).is(':checked'));
  }

  changeSnapVertex(event) {
    this.model.update('snapVertex', $(event.currentTarget).is(':checked'));
  }

  changeSnapEdge(event) {
    this.model.update('snapEdge', $(event.currentTarget).is(':checked'));
  }

  changeSnapSurface(event) {
    this.model.update('snapSurface', $(event.currentTarget).is(':checked'));
  }

  snap(mouseScreenPos, mouseWorldPos) {
    function round(position, roundSize) {
      return new THREE.Vector3(
        decimalAdjust(Math.round(position.x/roundSize)*roundSize, -3),
        decimalAdjust(Math.round(position.y/roundSize)*roundSize, -3),
        decimalAdjust(Math.round(position.z/roundSize)*roundSize, -3));
    }

    function distance(a, b) {
      return Math.sqrt(
        Math.pow(a.x - b.x, 2) +
        Math.pow(a.y - b.y, 2));
    }

    const scene = this.threeJSScene;
    const width = scene.width;
    const height = scene.height;
    const camera = scene.camera;
    const model = this.model;
    const planeOrigin = new THREE.Vector3(0,0,0);
    let planeNormal;
    if (this.model.orientation === 'XY') {
      planeNormal = new THREE.Vector3(0,0,1);
    } else if (this.model.orientation === 'YZ') {
      planeNormal = new THREE.Vector3(1,0,0);
    } else if (this.model.orientation === 'ZX') {
      planeNormal = new THREE.Vector3(0,1,0);
    }
    let unsnappedOnCPlane = worldPositionToPlane(
      mouseWorldPos,
      planeOrigin,
      planeNormal,
      camera);
    if (unsnappedOnCPlane) {
      unsnappedOnCPlane = round(unsnappedOnCPlane, 0.001);
    } else {
      // No plane intersection
      console.warn('no construction plane intersection');
      unsnappedOnCPlane = {x: 0, y: 0, z: 0};
    }
    const snapCandidates = [];

    // Compute snap candidates for each snap type. Distance is
    // calcualted in screen coordinates (i.e. closest snap result to
    // the mouse cursor on the screen)

    // Grid candidates
    if (model.snapGrid) {
      const snapped = round(unsnappedOnCPlane, model.size);
      const snapScreenPos = toScreenPosition(width, height, camera, snapped);
      snapCandidates.push({
        position: snapped,
        distance: distance(snapScreenPos, mouseScreenPos),
      });
    }

    // Vertex candidates
    if (model.snapVertex) {
      scene.views.forEach((v) => {
        if (v.vertices) {
          v.vertices.forEach((c) => {
            const snapScreenPos = toScreenPosition(width, height, camera, c);
            snapCandidates.push({
              position: round(c, 0.01),
              distance: distance(snapScreenPos, mouseScreenPos),
              view: v,
              type: 'vertex',
              object: c,
            });
          });
        }
      });
    }

    // Edge candidates
    if (model.snapEdge) {
      scene.views.forEach((v) => {
        if (v.edges) {
          v.edges.forEach((e) => {
            const snapEdgePos = closestPointToEdge(mouseWorldPos, e, camera);
            if (snapEdgePos) {
              const snapScreenPos = toScreenPosition(width, height, camera, snapEdgePos);
              snapCandidates.push({
                distance: distance(snapScreenPos, mouseScreenPos),
                position: round(snapEdgePos, 0.001),
                view: v,
                type: 'edge',
                object: e,
              });
            }
          });
        }
      });
    }

    // Surface candidates
    if (model.snapSurface) {
      const closestViewResult = findClosestViewForScreenPosition(
        scene,
        mouseScreenPos,
        this.viewFilterForSurfaceSnap);
      if (closestViewResult) {
        const snapScreenPos = toScreenPosition(width, height, camera, closestViewResult.position);
        snapCandidates.push({
          distance: distance(snapScreenPos, mouseScreenPos),
          position: round(closestViewResult.position, 0.001),
          view: closestViewResult.view,
          type: 'surface',
          object: closestViewResult.mesh,
        });
      }
    }

    if (snapCandidates.length) {
      let closest = snapCandidates.reduce((acc, c) => {
        if (acc) {
          if (c.distance < acc.distance) {
            acc = c;
          }
        } else {
          acc = c;
        }
        return acc;
      }, undefined);
      return {
        position: closest.position,
        view: closest.view,
        type: closest.type,
        object: closest.object,
      };
    } else {
      return {
        position: unsnappedOnCPlane,
      };
    }
  }

}

module.exports = SnapController;
