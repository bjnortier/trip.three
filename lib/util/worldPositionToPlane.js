const THREE = require('three');

module.exports = function(worldPosition, origin, normal, camera) {

  // https://github.com/mrdoob/three.js/blob/master/src/core/Raycaster.js
  let ray = new THREE.Ray();
  if (camera instanceof THREE.PerspectiveCamera) {
    ray.origin.setFromMatrixPosition(camera.matrixWorld);
    ray.direction.copy(worldPosition.clone().sub(ray.origin).normalize());
  } else if ( camera instanceof THREE.OrthographicCamera ) {
    ray.origin.copy(worldPosition);
    ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);
  } else {
    console.error('worldPositionToPlane: Unsupported camera type.');
  }

  // http://en.wikipedia.org/wiki/Line-plane_intersection
  const p0 = origin;
  const l0 = ray.origin;
  const l = ray.direction;
  const n = normal;

  const d = new THREE.Vector3().subVectors(p0, l0).dot(n)/l.dot(n);
  if (d === 0) {
    return undefined;
  }
  return new THREE.Vector3().addVectors(l0, l.clone().multiplyScalar(d));
};
