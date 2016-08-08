'use strict';

const expect = require('expect');
const SnapModel = require('../../src').SnapModel;

const defaultSnapState = {
  'grid': {
    'extents': 10,
    'extentsOptions': [
      1,
      5,
      10,
    ],
    'size': 1,
    'sizeOptions': [
      1,
      0.5,
      0.1,
    ],
  },
  'localX': {
    'x': 1,
    'y': 0,
    'z': 0,
  },
  'normal': {
    'x': 0,
    'y': 0,
    'z': 1,
  },
  'origin': {
    'x': 0,
    'y': 0,
    'z': 0,
  },
  'snappables': {
    'edge': false,
    'grid': true,
    'surface': false,
    'vertex': false,
  },
};

describe('Snap Model', () => {

  it('accepts redux actions', () => {
    const m = new SnapModel();

    const before = m.store.getState();
    m.store.dispatch({
      type: 'TOGGLE_SNAP',
      label: 'surface',
    });
    const after = m.store.getState();

    expect(before).toEqual(defaultSnapState);

    const expectedAfter = {
      ...defaultSnapState,
      snappables: {
        surface: true,
        edge: false,
        vertex: false,
        grid: true,
      },
    };
    expect(after).toEqual(expectedAfter);
  });

  it('can be serialized', () => {
    const m = new SnapModel();
    const s = m.serialize();

    expect(s).toEqual({
      gridSize : 1,
      extents : 10,
      snapGrid : true,
      snapVertex : false,
      snapEdge : false,
      snapSurface : false,
      origin : {x: 0, y: 0, z: 0},
      normal : {x: 0, y: 0, z: 1},
      localX : {x: 1, y: 0, z: 0},
    });


    m.deserialize({
      gridSize : 5,
      extents : 20,
      snapGrid : false,
      snapVertex : true,
      snapEdge : true,
      snapSurface : true,
      origin : {x: 10, y: 7, z: 8},
      normal : {x: 1, y: 0, z: 0},
      localX : {x: 0, y: 1, z: 0},
    });

    const expectedState = {
      'grid': {
        'extents': 20,
        'extentsOptions': [
          1,
          5,
          10,
        ],
        'size': 5,
        'sizeOptions': [
          1.0,
          0.5,
          0.1,
        ],
      },
      'localX': {
        'x': 0,
        'y': 1,
        'z': 0,
      },
      'normal': {
        'x': 1,
        'y': 0,
        'z': 0,
      },
      'origin': {
        'x': 10,
        'y': 7,
        'z': 8,
      },
      'snappables': {
        'surface': true,
        'edge': true,
        'vertex': true,
        'grid': false,
      },
    };
    expect(m.store.getState()).toEqual(expectedState);
  });

});
