import React from 'react';

const GridSize = ({ store, onGridSizeChange }) => {
  let select;
  return (
    <select name='grid-sizes'
      disabled={store.getState().grid === false}
      ref={node => select = node}
      onChange={() => {
        onGridSizeChange(select.value);
      }}
    >
      {store.getState().gridSizes.map((size, i) => {
        return (
          <option
            key={i}
            value={size}
            defaultChecked={store.getState().gridSize === size}
          >
          {size}
          </option>
        );
      })}
    </select>
  );
};

export default GridSize;
