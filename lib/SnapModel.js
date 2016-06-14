'use strict';

const Model = require('trip.core').Model;

class SnapModel extends Model {

  constructor(options) {
    options = options || {};
    super();
    this.size = options.size || 1.0;
    this.sizeOptions = options.sizeOptions || [1.0, 0.5, 0.1];
    this.extents = options.extents || 10;
    this.snapGrid = options.snapGrid || true;
    this.snapVertex = options.snapVertex || false;
    this.snapEdge = options.snapEdge || false;
    this.snapSurface = options.snapSurface || false;
    this.origin = {
      x: 0, y: 0, z: 0,
    };
    this.normal = {
      x: 0, y: 0, z: 1,
    };
    this.localX = {
      x: 1, y: 0, z: 0,
    };
  }

  update(field, value) {
    this[field] = value;
    this.emitChange(field, value);
  }

  updateOriginAndOrientation(props) {
    this.origin = props.origin;
    this.normal = props.normal;
    this.localX = props.localX;
    this.emitChange();
  }

}

module.exports = SnapModel;
