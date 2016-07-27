
const snap = (
  state = {
    snappables: {
      surface: false,
      edge: false,
      vertex: false,
      grid: true,
    },
    gridSize: 0.1,
    gridSizes: [1.0, 0.5, 0.1],
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

export default snap;
