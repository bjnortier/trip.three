'use strict';

import { Model } from 'trip.core';
import { createStore } from 'redux';

class SnapModel extends Model {

  constructor(options) {
    options = options || {};
    super();
    this.size = options.size || 1.0;
    this.sizeOptions = options.sizeOptions || [1.0, 0.5, 0.1];
    this.extents = options.extents || 10;
    this.origin = {
      x: 0, y: 0, z: 0,
    };
    this.normal = {
      x: 0, y: 0, z: 1,
    };
    this.localX = {
      x: 1, y: 0, z: 0,
    };

    const reducer = (
      state = {
        snappables: {
          surface: options.snapSurface || false,
          edge: options.snapEdge || false,
          vertex: options.snapVertex || false,
          grid: options.snapGrid || true,
        },
        gridSize: options.size || 1.0,
        gridSizes: options.sizeOptions || [1.0, 0.5, 0.1],
      },
      action
    ) => {
      switch (action.type) {
      case 'TOGGLE_SNAP': {
        const snappables = Object.assign({}, state.snappables);
        snappables[action.label] = !snappables[action.label];
        return {
          ...state,
          snappables,
        };
      }
      case 'CHANGE_GRID_SIZE': {
        return Object.assign({}, state, {gridSize: parseFloat(action.size, 10)});
      }
      default:
        if (action.type !== '@@redux/INIT') {
          console.warn('UNKNOWN ACTION', action);
        }
        return state;
      }
    };
    this.store = createStore(reducer);

    this.__defineGetter__('snapSurface', () => {
      return this.store.getState().snappables.surface;
    });

    this.__defineGetter__('snapEdge', () => {
      return this.store.getState().snappables.edge;
    });

    this.__defineGetter__('snapVertex', () => {
      return this.store.getState().snappables.vertex;
    });

    this.__defineGetter__('snapGrid', () => {
      return this.store.getState().snappables.grid;
    });

    this.unsubscribe = this.store.subscribe(() => {
      this.emitChange();
    });
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

  serialize() {
    return {
      size : this.size,
      sizeOptions : this.sizeOptions,
      extents : this.extents,
      snapGrid : this.snapGrid,
      snapVertex : this.snapVertex,
      snapEdge : this.snapEdge,
      snapSurface : this.snapSurface,
      origin : this.origin,
      normal : this.normal,
      localX : this.localX,
    };
  }

  deserialize(state) {
    this.size = state.size;
    this.sizeOptions = state.sizeOptions;
    this.extents = state.extents;
    this.snapGrid = state.snapGrid;
    this.snapVertex = state.snapVertex;
    this.snapEdge = state.snapEdge;
    this.snapSurface = state.snapSurface;
    this.origin = state.origin;
    this.normal = state.normal;
    this.localX = state.localX;
    this.emitChange();
  }

}

module.exports = SnapModel;
