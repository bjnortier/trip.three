'use strict';

const THREE = require('three');

const View = require('./View');

const positionOnXY = require('./util/positionOnXY');
const decimalAdjust = require('./util/decimalAdjust');
const closestPointToEdges = require('./util/closestPointToEdges');

class CPlane3View extends View {

  constructor(model, scene, options) {
    options = options || {};
    options.layer = 0;
    super(model, scene, options);

    function round(xy, roundSize) {
      return {
        x: decimalAdjust(Math.round(xy.x/roundSize)*roundSize, -1),
        y: decimalAdjust(Math.round(xy.y/roundSize)*roundSize, -1),
      };
    }

    function distance(a, b) {
      return Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
    }

    function snap(xy) {
      var unsnapped = round(xy, 0.01);
      var snapCandidates = [];

      // Grid candidates
      if (model.snapGrid) {
        var snapped = round(xy, model.size);
        snapCandidates.push({
          position: snapped,
          distance: distance(snapped, unsnapped),
        });
      }

      // Corner candidates
      if (model.snapCorners && model.corners.length) {
        model.corners.forEach((c) => {
          snapCandidates.push({
            distance: distance(c, unsnapped),
            position: round(c, 0.01),
          });
        });
      }

      // Edge candidates
      if (model.snapEdges && model.edges.length) {
        var closestOnEdge = closestPointToEdges(xy, model.edges);
        if (closestOnEdge) {
          snapCandidates.push({
            distance: closestOnEdge.distance,
            position: round(closestOnEdge.position, 0.01),
          });
        }
      }

      var closest = snapCandidates.reduce((acc, c) => {
        if (acc) {
          if (c.distance < acc.distance) {
            acc = c;
          }
        } else {
          acc = c;
        }
        return acc;
      }, undefined);

      if (closest) {
        return closest.position;
      } else {
        return unsnapped;
      }
    }

    var _this = this;
    scene.rawEventGenerator.on('mousemove', function(event, screenPosition) {
      var xy = positionOnXY(scene, screenPosition);
      _this.emit('mousemove', event, snap(xy));
    });
    scene.rawEventGenerator.on('click', function(event, screenPosition) {
      var xy = positionOnXY(scene, screenPosition);
      _this.emit('click', event, snap(xy));
    });
  }

  render() {
    super.render();

    var gridExtents = this.model.extents;
    var axesGeometry = new THREE.Geometry();
    var axesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    axesGeometry.vertices.push(new THREE.Vector3(0, -gridExtents, 0));
    axesGeometry.vertices.push(new THREE.Vector3(0, +gridExtents, 0));
    axesGeometry.vertices.push(new THREE.Vector3(-gridExtents, 0, 0));
    axesGeometry.vertices.push(new THREE.Vector3(+gridExtents, 0, 0));
    this.sceneObject.add(new THREE.LineSegments(axesGeometry, axesMaterial));

    if (this.model.snapGrid) {
      var minorGeometry = new THREE.Geometry();
      var minorMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc, linewidth: 1 });
      var gridSize = this.model.size;
      var n = gridExtents/gridSize;

      for (var x = -n; x <= n; ++x) {
        if (x !== 0) {
          minorGeometry.vertices.push(new THREE.Vector3(x*gridSize, -gridExtents, 0));
          minorGeometry.vertices.push(new THREE.Vector3(x*gridSize, +gridExtents, 0));
        }
      }
      for (var y = -n; y <= n; ++y) {
        if (y !== 0) {
          minorGeometry.vertices.push(new THREE.Vector3(-gridExtents, y*gridSize, 0));
          minorGeometry.vertices.push(new THREE.Vector3(+gridExtents, y*gridSize, 0));
        }
      }
      this.sceneObject.add(new THREE.LineSegments(minorGeometry, minorMaterial));
    }
  }

  update() {
    this.render();
  }

}

module.exports = CPlane3View;
