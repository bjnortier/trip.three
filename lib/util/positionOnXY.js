'use strict';

const toWorldPosition = require('./toWorldPosition');

module.exports = function(scene, screenPosition) {
  var worldPosition = toWorldPosition(scene.width, scene.height, scene.camera, screenPosition);
  return {
    x: worldPosition.x,
    y: worldPosition.y,
  };
};
