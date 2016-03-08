const THREE = require('three');

module.exports = function(worldPos, edge, camera) {

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

  var from = edge[0];
  var direction = new THREE.Vector3().subVectors(edge[1], edge[0]);

  // http://softsurfer.com/Archive/algorithm_0106/algorithm_0106.htm
  var u = direction.clone().normalize();
  var v = ray.direction;

  var w0 = new THREE.Vector3().subVectors(from, ray.origin);
  var a = u.dot(u);
  var b = u.dot(v);
  var c = v.dot(v);
  var d = u.dot(w0);
  var e = v.dot(w0);

  var sc = (b*e - c*d)/(a*c - b*b);
  // var tc = (a*e - b*d)/(a*c - b*b);

  var psc = new THREE.Vector3().addVectors(from, u.clone().multiplyScalar(sc));
  // var qtc = new THREE.Vector3().addVectors(mouseRay.origin, v.clone().multiplyScalar(tc));

  // Check if one the edge or outside by checking the distance to the endpoints
  // is less than the length of the edge
  var l = direction.length();
  if ((new THREE.Vector3().subVectors(psc, edge[0]).length() <= l) &&
      (new THREE.Vector3().subVectors(psc, edge[1]).length() <= l)) {
    return psc;
  } else {
    return null;
  }
};
