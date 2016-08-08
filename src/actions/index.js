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

export const changeGridExtents = (extents) => {
  return {
    type: 'CHANGE_GRID_EXTENTS',
    extents,
  };
};
