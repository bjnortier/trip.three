'use strict';

const THREE = require('three');

const View = require('./View');

class CPlane3View extends View {

  constructor(model, scene, options) {
    options = options || {};
    options.layer = 0;
    super(model, scene, options);
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
