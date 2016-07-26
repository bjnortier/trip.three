
const snap = (
  state = {
    surface: false,
    edge: false,
    vertex: false,
    grid: true,
  },
  action
) => {
  switch (action.type) {
  case 'TOGGLE_SNAP':
    {
      const toggled = {};
      toggled[action.key] = !state[action.key];
      return Object.assign({}, state, toggled);
    }
  default:
    return state;
  }
};

export default snap;
