export const toggleSnap = (label) => {
  return {
    type: 'TOGGLE_SNAP',
    label,
  };
};

export const changeGridSize = (size) => {
  return {
    type: 'CHANGE_GRID_SIZE',
    size,
  };
};
