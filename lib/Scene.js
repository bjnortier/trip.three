'use strict';

const tripcore = require('trip.core');
const THREE = require('three');

// const OrbitControls = require('./OrbitControls');
const RawEventGenerator = require('./RawEventGenerator');
const ViewEventGenerator = require('./ViewEventGenerator');
const Trackball = require('./Trackball');

class Scene extends tripcore.Scene {

  constructor(container, options) {
    super(container, options);

    options = (options === undefined) ? {} : options;
    if (options.cameraPosition === undefined) {
      options.cameraPosition = {
        x: 0.2,
        y: -2,
        z: 1.5,
      };
    }
    if (options.cameraUp === undefined) {
      options.cameraUp = {
        x: 0,
        y: 0,
        z: 1,
      };
    }

    this.rawEventGenerator = new RawEventGenerator(container);
    this.viewEventGenerator = new ViewEventGenerator(this);
    this.views = [];

    // Each layer has a scene
    const layers = [new THREE.Scene()];
    if (options.layers) {
      for (var i = 0; i < options.layers - 1; ++i) {
        layers.push(new THREE.Scene());
      }
    }

    // lights
    var directionalLights = layers.map(function(layer) {
      var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(-1, -1, -1);
      layer.add(directionalLight);
      layer.add(new THREE.AmbientLight(0x222222));
      return directionalLight;
    });

    // renderer
    let width = container.width();
    let height = container.height();
    this.aspect = width/height;
    let redraw = true;
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xffffff, 1);
    renderer.autoClear = false;
    renderer.setSize(width, height);
    container[0].appendChild(renderer.domElement);

    // debug
    // scene.add(new THREE.Mesh(
    //   new THREE.BoxGeometry(1,1,1),
    //   new THREE.MeshLambertMaterial({color: 0x0000ff, transparent: true, opacity: 0.5})));

    // Cameras
    var near = options.near || 0.1;
    var far = options.far || 1000;
    this.perspectiveCamera = new THREE.PerspectiveCamera(60, width / height, near, far);
    this.orthographicCamera = new THREE.OrthographicCamera(-10000, 10000, 5000, -5000, 1, 250000);

    let mode;
    if ((options.mode === undefined) || (option.mode === 'perspective')) {
      mode = 'perspective';
      this.camera = this.perspectiveCamera;
    } else if (options.mode === 'orthographic') {
      mode = 'orthographic';
      this.camera = this.orthographicCamera;
    } else {
      throw new Error('unknown mode:' + options.mode);
    }

    this.camera.up.set(
      options.cameraUp.x,
      options.cameraUp.y,
      options.cameraUp.z);
    this.camera.position.set(
      options.cameraPosition.x,
      options.cameraPosition.y,
      options.cameraPosition.z);

    this.__defineSetter__('mode', (val) => {
      if (val === 'perspective') {
        mode = val;
        this.camera = this.perspectiveCamera;
      } else if (val === 'orthographic') {
        mode = val;
        this.camera = this.orthographicCamera;
      } else {
        throw new Error('unknown mode:' + mode);
      }
    });

    this.__defineGetter__('mode', function() {
      return mode;
    });

    this.redraw = function() {
      redraw = true;
    };

    this.trackball = new Trackball(this, this.rawEventGenerator);

    const _this = this;

    function render() {
      let camera = _this.camera;
      if (redraw) {
        directionalLights.forEach(function(light) {
          light.position.copy(camera.position);
        });
        renderer.clear();
        renderer.render(layers[0], camera);
        for (var i = 1; i < layers.length; ++i) {
          renderer.clearDepth();
          renderer.render(layers[i], camera);
        }
        redraw = false;
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function resize() {
      var width = container.width();
      var height = container.height();
      _this.aspect = width/height;
      let camera = _this.camera;
      camera.aspect = _this.aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      redraw = true;
    }

    this.add = function(view) {
      this.views.push(view);
      var layer = view.layer || 0;
      layers[layer].add(view.sceneObject);
      redraw = true;
    };

    this.remove = function(view) {
      var layer = view.layer || 0;
      var index = this.views.indexOf(view);
      if (index === -1) {
        throw new Error('view not found');
      }
      this.views.splice(index, 1);
      layers[layer].remove(view.sceneObject);
      render();
    };

    window.addEventListener('resize', resize, false);
    // Resize on the next event loop tick since a scroll bar may have been added
    // in the meantime.
    setTimeout(resize, 0);

    animate();

  }

  setPerspective() {
    this.mode = 'perspective';
    this.trackball.setTarget({
      azimuth: -Math.PI/4,
      elevation: 1.08,
    });
  }

  setOrthoXPos() {
    this.mode = 'orthographic';
    this.trackball.setTarget({
      elevation: Math.PI/2,
    });
  }

  setOrthoXNeg() {
    this.mode = 'orthographic';
    this.trackball.setTarget({
      elevation: Math.PI/2,
      azimuth: Math.PI,
    });
  }

  setOrthoYPos() {
    this.mode = 'orthographic';
    this.trackball.setTarget({
      elevation: Math.PI/2,
      azimuth: Math.PI/2,
    });
  }

  setOrthoYNeg() {
    this.mode = 'orthographic';
    this.trackball.setTarget({
      elevation: Math.PI/2,
      azimuth: Math.PI*3/2,
    });
  }

  setOrthoZPos() {
    this.mode = 'orthographic';
    this.trackball.setTarget({
      up: new THREE.Vector3(0,1,0),
    });
  }

  setOrthoZNeg() {
    this.mode = 'orthographic';
    this.trackball.setTarget({
      elevation: Math.PI,
      up: new THREE.Vector3(0, 1, 0),
    });
  }


  // Zoom to extents if the camera is constrained to
  // move in the XY plane (no rotation). I.e. of the scene
  // is a 2D view
  // this.zoomTo2DExtents = function(filterFn) {
  //   // var bounds = layers.reduce(function(acc, scene, i) {
  //   //   // Optionally filters on the layers to include in the
  //   //   // zoom
  //   //   if (filterFn) {
  //   //     if (filterFn(scene, i)) {
  //   //       return acc.union(new THREE.Box3().setFromObject(scene));
  //   //     } else {
  //   //       return acc;
  //   //     }
  //   //   } else {
  //   //     return acc.union(new THREE.Box3().setFromObject(scene));
  //   //   }
  //   // }, new THREE.Box3());
  //
  //   // var centerX = (bounds.min.x + bounds.max.x)/2;
  //   // var centerY = (bounds.min.y + bounds.max.y)/2;
  //   // camera.position.setX(centerX);
  //   // camera.position.setY(centerY);
  //   throw new Error('target position not implemented');
  //   //
  //   // var margin = 10; // degrees of view margin around objects
  //   //
  //   // // For the max Y coordinate
  //   // var distanceRequiredForY =
  //   //   (bounds.max.y - centerY) /
  //   //   Math.tan((camera.fov - margin)/2/180*Math.PI);
  //   //
  //   // // camera FOV is the vertical field of view, i.e. in the Y direction,
  //   // // so adjust using aspect ratio.
  //   // // For the max X coodrinate
  //   // var distanceRequiredForX =
  //   //   (bounds.max.x - centerX) /
  //   //   camera.aspect/Math.tan((camera.fov - margin)/2/180*Math.PI);
  //   //
  //   // camera.position.z = Math.max(distanceRequiredForX, distanceRequiredForY);
  //   //
  //   // redraw = true;
  // };

  // this.__defineGetter__('camera', () => {
  //   return camera;
  // });

}

module.exports = Scene;
