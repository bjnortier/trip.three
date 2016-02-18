'use strict';

const THREE = require('three');

class Trackball {

  constructor(scene, rawEventGenerator) {

    let target = {
      origin: new THREE.Vector3(),
      azimuth: -Math.PI/2,
      elevation: Math.PI/2,
      up: new THREE.Vector3(0,0,1),
      distance: 20,
    };

    function updateCamera() {
      if (scene.mode === 'perspective') {
        let r = target.distance;
        let elev = target.elevation;
        let azim = target.azimuth;
        let origin = target.origin;
        scene.camera.position.set(
          origin.x + r*Math.sin(elev) * Math.cos(azim),
          origin.y + r*Math.sin(elev) * Math.sin(azim),
          origin.z + r*Math.cos(elev));
      } else {
        throw new Error('not implemented');
      }

      scene.layers.forEach((layer) => {
        layer.position.copy(target.origin);
      });
      scene.camera.up = target.up;

      // NB lookAt() should be called after updating up and position
      // since those two values are used to determine the rotation matrix
      scene.camera.lookAt(new THREE.Vector3(0,0,0));

      scene.redraw();
    }

    let state;
    let azimElevOnDragStart;
    let lastMousePosition;
    let cameraPositionAtStart;

    function stateForButtons(event) {
      if (!event.shiftKey && (event.button === 0) && (scene.mode === 'perspective')) {
        return 'rotating';
      } else if ((event.button === 2) ||
        ((event.button === 0) && event.shiftKey)) {
        return 'panning';
      }
    }

    function startDrag(event, eventPosition) {
      azimElevOnDragStart = {
        azimuth: target.azimuth,
        elevation: target.elevation,
      };
      cameraPositionAtStart = scene.camera.position.clone();
      lastMousePosition = eventPosition;
    }

    function drag(event, eventPosition, mouseDownPosition) {
      var dMouseFromDown = {
        x: eventPosition.x - mouseDownPosition.x,
        y: eventPosition.y - mouseDownPosition.y,
      };
      var dMouseFromLast = {
        x: eventPosition.x - lastMousePosition.x,
        y: eventPosition.y - lastMousePosition.y,
      };

      if (state === undefined) {
        state = stateForButtons(event);
      }

      if (state === 'rotating') {
        let zoomDamp = 0.01;
        target.azimuth = azimElevOnDragStart.azimuth - dMouseFromDown.x * zoomDamp;
        target.elevation = azimElevOnDragStart.elevation - dMouseFromDown.y * zoomDamp;
        target.elevation = target.elevation > Math.PI ? Math.PI : target.elevation;
        target.elevation = target.elevation < 0 ? 0 : target.elevation;
        updateCamera();
      }

      if (state === 'panning') {
        var camVec = cameraPositionAtStart.clone().negate().normalize();
        var upVec = target.up;
        var mouseLeftVec = new THREE.Vector3().crossVectors(upVec, camVec);
        var mouseUpVec = new THREE.Vector3().crossVectors(camVec, mouseLeftVec);

        // The camera moved in the opposite direction
        var dPos = mouseLeftVec.clone().multiplyScalar(-dMouseFromLast.x)
          .add(mouseUpVec.clone().multiplyScalar(-dMouseFromLast.y));
        // Negative since the position should move in the opposite direction
        dPos.multiplyScalar(target.distance/1000);
        target.origin.add(dPos);
        updateCamera();
      }

      lastMousePosition = eventPosition;

    }

    function cancel() {
      state = undefined;
      lastMousePosition = undefined;
      updateCamera();
    }

    // We want to keep rotating/panning if the mouse leaves
    // the window and re-enters, but if the user has lifted the
    // mouse button during the time off-window, the operation
    // should be cancelled
    function windowMouseUp() {
      if (state) {
        cancel();
      }
    }

    rawEventGenerator.on('startdrag', startDrag);
    rawEventGenerator.on('drag', drag);
    rawEventGenerator.on('stopdrag', cancel, this);
    rawEventGenerator.on('windowmouseup', windowMouseUp, this);

    updateCamera();
  }

}

module.exports = Trackball;
