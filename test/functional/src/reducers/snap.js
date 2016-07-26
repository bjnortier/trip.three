
const snap = (
  state = {
    surface: false,
    edge: false,
    vertex: false,
    grid: true,
    gridSize: 0.1,
    gridSizes: [1.0, 0.5, 0.1],
  },
  action
) => {
  switch (action.type) {
  case 'TOGGLE_SNAP': {
    const toggled = {};
    toggled[action.key] = !state[action.key];
    return Object.assign({}, state, toggled);
  }
  case 'CHANGE_GRID_SIZE': {
    return Object.assign({}, state, {gridSize: parseFloat(action.value, 10)});
  }
  default:
    if (action.type !== '@@redux/INIT') {
      console.warn('UNKNOWN ACTION', action);
    }
    return state;
  }
};

export default snap;
