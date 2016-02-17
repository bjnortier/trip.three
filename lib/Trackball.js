'use strict';

const THREE = require('three');

function eventToPosition(event) {
  return {
    x: event.offsetX,
    y: event.offsetY,
  };
}

var Trackball = function(sceneView, rawEventGenerator) {

  var maxZoom = 64;
  var minZoom = 0.01;
  var target = {
    azimuth: -Math.PI/4,
    elevation: 1.08,
    up: new THREE.Vector3(0,0,1),
    dScenePosition: new THREE.Vector3(),
    zoom: 16,
  };
  var lastMousePosition;
  var targetOnDown;
  var state;
  var disableRotate = false;

  function mousedown() {
    targetOnDown = {
      azimuth:  target.azimuth,
      elevation: target.elevation,
    };
  }

  function mouseuporleave() {
    state = undefined;
    lastMousePosition = undefined;
    updateCamera();
  }

  function drag(event) {
    if (event.handled) {
      return;
    }

    if (lastMousePosition) {
      var eventPosition = eventToPosition(event);
      var mouseDownPosition = eventToPosition(event.mouseDownEvent);

      var dMouseFromDown = {
        x: eventPosition.x - mouseDownPosition.x,
        y: eventPosition.y - mouseDownPosition.y,
      };
      var dMouseFromLast = {
        x: eventPosition.x - lastMousePosition.x,
        y: eventPosition.y - lastMousePosition.y,
      };

      if (state === undefined) {
        if (!event.shiftKey && (event.button === 0) && !disableRotate) {
          state = 'rotating';
        } else if ((event.button === 2) ||
          ((event.button === 0) && event.shiftKey)) {
          state = 'panning';
        }
      }

      if (state === 'rotating') {
        var zoomDamp = 0.01;
        target.azimuth = targetOnDown.azimuth - dMouseFromDown.x * zoomDamp;
        target.elevation = targetOnDown.elevation - dMouseFromDown.y * zoomDamp;
        target.elevation = target.elevation > Math.PI ? Math.PI : target.elevation;
        target.elevation = target.elevation < 0 ? 0 : target.elevation;
        updateCamera();
      }

      if (state === 'panning') {

        var camVec = sceneView.camera.position.clone().negate().normalize();
        var upVec = target.up;
        var mouseLeftVec = new THREE.Vector3().crossVectors(upVec, camVec);
        var mouseUpVec = new THREE.Vector3().crossVectors(camVec, mouseLeftVec);

        var dPos = mouseLeftVec.clone().multiplyScalar(dMouseFromLast.x).add(
          mouseUpVec.clone().multiplyScalar(dMouseFromLast.y));
        // Negative since the position should move in the opposite direction
        dPos.multiplyScalar(target.zoom);

        target.dScenePosition = dPos;
        updateCamera();
      }

    }
    lastMousePosition = eventToPosition(event);
  }

  function mousewheel(event) {
    event.preventDefault();
    event.stopPropagation();
    // Webkit vs Firefox
    var data = event.originalEvent.wheelDelta ?
      -event.originalEvent.wheelDelta/120 :
      event.originalEvent.detail;

    if (data > 0) {
      target.zoom *= 1.5;
    } else {
      target.zoom /= 1.5;
    }
    updateCamera();
  }

  function keyup(event) {
    switch (event.keyCode) {
    case 187:
    case 107:
      target.zoom /= 2;
      event.preventDefault();
      break;
    case 189:
    case 109:
      target.zoom *= 2;
      event.preventDefault();
      break;
    }
    updateCamera();
  }


  function updateCamera() {
    target.zoom = Math.min(target.zoom, maxZoom);
    target.zoom = Math.max(target.zoom, minZoom);

    var r;
    if (sceneView.camera === sceneView.perspectiveCamera) {
      r = target.zoom * 1000;
      sceneView.camera.position.set(
        r*Math.sin(target.elevation) * Math.cos(target.azimuth),
        r*Math.sin(target.elevation) * Math.sin(target.azimuth),
        r*Math.cos(target.elevation));
      sceneView.camera.raycasterPosition = sceneView.camera.position;
    } else {
      // Seems like this should be < the far ortho frustrum
      r = 200000;
      var width = sceneView.$el.width();
      var height = sceneView.$el.height();
      var aspect = width/height;
      sceneView.orthoCamera.left = -target.zoom*1000;
      sceneView.orthoCamera.right = target.zoom*1000;
      sceneView.orthoCamera.top = target.zoom*1000/aspect;
      sceneView.orthoCamera.bottom = -target.zoom*1000/aspect;
      sceneView.orthoCamera.updateProjectionMatrix();
      sceneView.camera.position.set(
        r*Math.sin(target.elevation) * Math.cos(target.azimuth),
        r*Math.sin(target.elevation) * Math.sin(target.azimuth),
        r*Math.cos(target.elevation));

      // NB radius should be the same as the Ortho camera FAR frustrum position
      // See event.util for explanation of these gymnastics
      var r2 =  10000000;
      sceneView.camera.raycasterPosition = new THREE.Vector3(
        r2*Math.sin(target.elevation) * Math.cos(target.azimuth),
        r2*Math.sin(target.elevation) * Math.sin(target.azimuth),
        r2*Math.cos(target.elevation));
    }

    sceneView.scene.position.add(target.dScenePosition.clone());
    target.dScenePosition.set(0, 0, 0);
    sceneView.camera.up = target.up;
    sceneView.camera.position.add(sceneView.scene.position.clone());

    // NB lookAt() should be called after updating up and position
    // since those two values are used to determine the rotation matrix
    sceneView.camera.lookAt(sceneView.scene.position);

    sceneView.update = true;
  }

  function resetTarget() {
    target.azimuth = 0;
    target.elevation = 0;
    target.up = new THREE.Vector3(0, 0, 1);
    sceneView.scene.position.set(0, 0, 0);
  }

  this.switchToPerspective = function() {
    resetTarget();
    sceneView.inPerspectiveMode = true;
    sceneView.mode = 'perspective';
    target.azimuth = -Math.PI/4;
    target.elevation = 1.08;
    target.zoom = 8;
    disableRotate = false;
    updateCamera();
  };

  this.switchToTopBottom = function() {
    resetTarget();
    sceneView.inPerspectiveMode = false;
    if (sceneView.mode === 'top') {
      sceneView.mode = 'bottom';
      target.elevation = Math.PI;
      target.up = new THREE.Vector3(0,-1,0);
    } else {
      sceneView.mode = 'top';
      target.up = new THREE.Vector3(0,1,0);
    }
    disableRotate = true;
    updateCamera();
  };

  this.switchToEastWest = function() {
    resetTarget();
    sceneView.inPerspectiveMode = false;
    if (sceneView.mode === 'east') {
      target.azimuth = Math.PI;
      sceneView.mode = 'west';
    } else {
      sceneView.mode = 'east';
    }
    target.elevation = Math.PI/2;
    disableRotate = true;
    updateCamera();
  };

  this.switchToSouthNorth = function() {
    resetTarget();
    sceneView.inPerspectiveMode = false;
    if (sceneView.mode === 'south') {
      sceneView.mode = 'north';
      target.azimuth = Math.PI/2;
    } else {
      sceneView.mode = 'south';
      target.azimuth = 3*Math.PI/2;
    }
    target.elevation = Math.PI/2;
    disableRotate = true;
    updateCamera();
  };

  rawEventGenerator.on('drag', drag, this);
  rawEventGenerator.on('mousedown', mousedown, this);
  rawEventGenerator.on('mouseup', mouseuporleave, this);
  rawEventGenerator.on('mouseleave', mouseuporleave, this);
  rawEventGenerator.on('mousewheel', mousewheel, this);
  rawEventGenerator.on('keyup', keyup, this);

  sceneView.on('resized', updateCamera, this);

  updateCamera();

};

module.exports = Trackball;
