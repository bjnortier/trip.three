'use strict';

const THREE = require('three');

module.exports = function(width, height, camera, position) {
  const mouseX = (position.x/width)*2 - 1;
  const mouseY = -(position.y/height) * 2 + 1;
  // return vector.unproject(camera);

  if (camera instanceof THREE.PerspectiveCamera) {
    const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
    return vector.unproject(camera);
  } else if ( camera instanceof THREE.OrthographicCamera ) {
    const vector = new THREE.Vector3(mouseX, mouseY, -1);
    return vector.unproject(camera);
  }
};
