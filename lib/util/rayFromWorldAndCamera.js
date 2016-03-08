'use strict';

const THREE = require('three');

// https://github.com/mrdoob/three.js/blob/master/src/core/Raycaster.js
module.exports = function(worldPos, camera) {
  let ray = new THREE.Ray();
  if (camera instanceof THREE.PerspectiveCamera) {
    ray.origin.setFromMatrixPosition(camera.matrixWorld);
    ray.direction.copy(worldPos.clone().sub(ray.origin).normalize());
  } else if ( camera instanceof THREE.OrthographicCamera ) {
    ray.origin.copy(worldPos);
    ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);
  } else {
    console.error('worldPositionToPlane: Unsupported camera type.');
  }
  return ray;
};
