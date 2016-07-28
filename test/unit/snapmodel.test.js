'use strict';

const expect = require('expect');
const SnapModel = require('../../src').SnapModel;

describe('Snap Model', () => {

  it('has defaults', () => {
    const m = new SnapModel();
    expect(m.gridSize).toEqual(1.0);
    expect(1.0).toEqual(1.0);
  });

});
