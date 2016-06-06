'use strict';

const THREE = require('three');
const worldPositionToPlane = require('./worldPositionToPlane');

module.exports = function(worldPos, camera) {
  const planeOrigin = new THREE.Vector3(0,0,0);
  const planeNormal = new THREE.Vector3(0,0,1);
  const onPlanePosition = worldPositionToPlane(worldPos, planeOrigin, planeNormal, camera);

  if (onPlanePosition === undefined) {
    // No intersection. Happens in orthographic side view. Just use the X or Y
    return new THREE.Vector3(worldPos.x, worldPos.y, 0);
  } else {
    return onPlanePosition;
  }
};
