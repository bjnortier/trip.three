'use strict';

const Model = require('trip.core').Model;

class CanvasModel extends Model {

  constructor() {
    super();
    this.size = 1.0;
    this.sizeOptions = [1.0, 0.5, 0.1];
    this.extents = 10;
    this.snapGrid = true;
    this.snapCorners = false;
    this.snapEdges = false;
    this.snapSurfaces = false;
  }

  update(field, value) {
    this[field] = value;
    this.emitChange();
  }

}

module.exports = CanvasModel;
