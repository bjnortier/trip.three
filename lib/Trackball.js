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
        // Seems like this should be < the far ortho frustrum
        let r = 1000;
        var width = scene.container.width();
        var height = scene.container.height();
        var aspect = width/height;
        scene.orthoCamera.left = -10;
        scene.orthoCamera.right = 10;
        scene.orthoCamera.top = 10/aspect;
        scene.orthoCamera.bottom = -10/aspect;
        scene.orthoCamera.updateProjectionMatrix();
        scene.camera.position.set(
          r*Math.sin(target.elevation) * Math.cos(target.azimuth),
          r*Math.sin(target.elevation) * Math.sin(target.azimuth),
          r*Math.cos(target.elevation));

        // NB radius should be the same as the Ortho camera FAR frustrum position
        // See event.util for explanation of these gymnastics
        // var r2 =  10000000;
        // scene.camera.raycasterPosition.copy(new THREE.Vector3(
        //   r2*Math.sin(target.elevation) * Math.cos(target.azimuth),
        //   r2*Math.sin(target.elevation) * Math.sin(target.azimuth),
        //   r2*Math.cos(target.elevation)));
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
        if (!event.shiftKey && (event.button === 0) && (scene.mode === 'perspective')) {
          state = 'rotating';
        } else if ((event.button === 2) ||
          ((event.button === 0) && event.shiftKey)) {
          state = 'panning';
        }
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

    this.setTarget = function(newTarget) {
      target = {
        origin: newTarget.origin || new THREE.Vector3(),
        azimuth: newTarget.azimuth || 0,
        elevation: newTarget.elevation || 0,
        up: newTarget.up || new THREE.Vector3(0,0,1),
        distance: newTarget.distance || 20,
      };
      updateCamera();
    };

    updateCamera();
  }

}

module.exports = Trackball;
