'use strict';

function closestPointOnEdge(p, a, b) {
  let ab = [b[0] - a[0], b[1] - a[1]];
  let ap = [p[0] - a[0], p[1] - a[1]];
  let ab_length = Math.sqrt(ab[0]*ab[0] + ab[1]*ab[1]);
  let ab_norm = [ab[0]/ab_length,ab[1]/ab_length];
  let projection = ap[0]*ab_norm[0] + ap[1]*ab_norm[1];
  let position = [a[0] + projection*ab_norm[0], a[1] + projection*ab_norm[1]];
  let perpendicular = [p[0] - position[0], p[1] - position[1]];
  let distance = Math.sqrt(perpendicular[0]*perpendicular[0] + perpendicular[1]*perpendicular[1]);
  return { distance, position };
}

module.exports = function(position, edges) {
  let p = [position.x, position.y];
  let closest = edges.reduce(function(acc, edge) {
    let a = [edge[0].x, edge[0].y];
    let b = [edge[1].x, edge[1].y];
    let ab = [b[0] - a[0], b[1] - a[1]];
    let ab_length_2 = ab[0]*ab[0] + ab[1]*ab[1];

    let closest = closestPointOnEdge(p, a, b);
    let closest_a = [a[0] - closest.position[0], a[1] - closest.position[1]];
    let closest_b = [b[0] - closest.position[0], b[1] - closest.position[1]];
    let closest_a_length_2 = [closest_a[0]*closest_a[0] + closest_a[1]*closest_a[1]];
    let closest_b_length_2 = [closest_b[0]*closest_b[0] + closest_b[1]*closest_b[1]];

    // Check if one the edge or outside by checking the distance to the endpoints
    // is less than the length of the edge
    if ((closest_a_length_2 <= ab_length_2) &&
        (closest_b_length_2 <= ab_length_2)) {
      if (closest.distance < acc.distance) {
        acc = closest;
      }
    }
    return acc;
  }, {
    distance: Infinity,
    position: null,
  });

  if (closest.position) {
    // Return normalized result
    return {
      distance: closest.distance,
      position: {
        x: closest.position[0],
        y: closest.position[1],
      },
    };
  } else {
    return null;
  }
};
