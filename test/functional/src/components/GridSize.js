import React from 'react';

const GridSize = ({ sizes, currentSize, enabled, onChange }) => {
  let select;
  return (
    <select name='grid-sizes'
      disabled={!enabled}
      ref={node => select = node}
      onChange={() => {
        onChange(select.value);
      }}
    >
      {sizes.map((size, i) => {
        return (
          <option
            key={i}
            value={size}
            defaultChecked={currentSize === size}
          >
          {size}
          </option>
        );
      })}
    </select>
  );
};

export default GridSize;
