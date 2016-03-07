const THREE = require('three');

module.exports = function(worldPosition, origin, normal, camera) {
  const ray = new THREE.Ray(camera.position); // To 0,0,0 is the default
  ray.direction = worldPosition.clone().sub(camera.position).normalize();

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
