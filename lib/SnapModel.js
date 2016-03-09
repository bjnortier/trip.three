'use strict';

const Model = require('trip.core').Model;

class CanvasModel extends Model {

  constructor(options) {
    options = options || {};
    super();
    this.size = options.size || 1.0;
    this.sizeOptions = options.sizeOptions || [1.0, 0.5, 0.1];
    this.extents = options.extents || 10;
    this.snapGrid = options.snapGrid || true;
    this.snapCorners = options.snapCorners || false;
    this.snapEdges = options.snapEdges || false;
    this.snapSurfaces = options.snapSurfaces || false;
  }

  update(field, value) {
    this[field] = value;
    this.emitChange();
  }

}

module.exports = CanvasModel;
