'use strict';

const tripcore = require('trip.core');

class CPlaneTestModel extends tripcore.Model {

  constructor() {
    super();
  }

  setCPlaneMouseMove(coordinate) {
    this.cplaneMouseMoveX = coordinate.x;
    this.cplaneMouseMoveY = coordinate.y;
    this.cplaneMouseMoveZ = coordinate.z;
    this.emitChange();
  }


}

module.exports = CPlaneTestModel;
