'use strict';

const THREE = require('three');
const worldPositionToPlane = require('./worldPositionToPlane');

module.exports = function(worldPosition, camera) {
  var planeOrigin = new THREE.Vector3(0,0,0);
  var planeNormal = new THREE.Vector3(0,0,1);
  return worldPositionToPlane(worldPosition, planeOrigin, planeNormal, camera);
};
