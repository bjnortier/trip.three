'use strict';

const Model = require('trip.core').Model;
const createStore = require('redux').createStore;

class SnapModel extends Model {

  constructor(options) {
    options = options || {};
    super();

    const reducer = (
      state = {
        snappables: {
          surface: options.snapSurface || false,
          edge: options.snapEdge || false,
          midpoint: options.snapMidpoint || false,
          intersection: options.snapIntersection || false,
          vertex: options.snapVertex || false,
          grid: options.snapGrid || true,
        },
        grid: {
          size: options.gridSize || 1.0,
          sizeOptions: options.gridSizeOptions || [1.0, 0.5, 0.1],
          extents: options.gridExtents || 10,
          extentsOptions: options.gridExtentsOptions || [1.0, 5.0,  10.0],
        },
        origin: {
          x: 0, y: 0, z: 0,
        },
        normal: {
          x: 0, y: 0, z: 1,
        },
        localX: {
          x: 1, y: 0, z: 0,
        },
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
        const grid = {
          ...state.grid,
          size: parseFloat(action.size, 10),
        };
        return {
          ...state,
          grid,
        };
      }
      case 'CHANGE_GRID_EXTENTS': {
        const grid = {
          ...state.grid,
          extents: parseFloat(action.extents, 10),
        };
        return {
          ...state,
          grid,
        };
      }
      case 'CHANGE_ORIGIN_AND_ORIENTATION': {
        const origin = action.origin;
        const normal = action.normal;
        const localX = action.localX;
        return {
          ...state,
          origin,
          normal,
          localX,
        };
      }
      case 'DESERIALIZE': {
        const origin = action.origin;
        const normal = action.normal;
        const localX = action.localX;
        const grid = {
          ...state.grid,
          size: action.gridSize,
          extents: action.extents,
        };
        return {
          ...state,
          grid,
          snappables: {
            surface: action.snapSurface,
            edge: action.snapEdge,
            midpoint: action.snapMidpoint,
            vertex: action.snapVertex,
            intersection: action.snapIntersection,
            grid: action.snapGrid,
          },
          origin,
          normal,
          localX,
        };
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

    this.__defineGetter__('snapMidpoint', () => {
      return this.store.getState().snappables.midpoint;
    });

    this.__defineGetter__('snapVertex', () => {
      return this.store.getState().snappables.vertex;
    });

    this.__defineGetter__('snapIntersection', () => {
      return this.store.getState().snappables.intersection;
    });

    this.__defineGetter__('snapGrid', () => {
      return this.store.getState().snappables.grid;
    });

    this.__defineGetter__('gridSize', () => {
      return this.store.getState().grid.size;
    });

    this.__defineGetter__('extents', () => {
      return this.store.getState().grid.extents;
    });

    this.__defineGetter__('origin', () => {
      return this.store.getState().origin;
    });

    this.__defineGetter__('normal', () => {
      return this.store.getState().normal;
    });

    this.__defineGetter__('localX', () => {
      return this.store.getState().localX;
    });

    this.unsubscribe = this.store.subscribe(() => {
      this.emitChange();
    });
  }

  updateOriginAndOrientation(props) {
    this.store.dispatch({
      type: 'CHANGE_ORIGIN_AND_ORIENTATION',
      origin: props.origin,
      normal: props.normal,
      localX: props.localX,
    });
  }

  serialize() {
    return {
      gridSize : this.gridSize,
      extents : this.extents,
      snapGrid : this.snapGrid,
      snapVertex : this.snapVertex,
      snapIntersection : this.snapIntersection,
      snapMidpoint : this.snapMidpoint,
      snapEdge : this.snapEdge,
      snapSurface : this.snapSurface,
      origin : this.origin,
      normal : this.normal,
      localX : this.localX,
    };
  }

  deserialize(state) {
    this.store.dispatch({
      type: 'DESERIALIZE',
      ...state,
    });
  }

}

module.exports = SnapModel;
