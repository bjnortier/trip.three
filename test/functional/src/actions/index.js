let nextTodoId = 0;
export const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text,
  };
};

export const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter,
  };
};

export const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id,
  };
};

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
