const React = require('react');

const GridSize = ({ sizeOptions, currentSize, enabled, onChange }) => {
  let select;
  return (
    <select name='grid-sizes'
      disabled={!enabled}
      ref={node => select = node}
      onChange={() => {
        onChange(select.value);
      }}
      value={currentSize}
    >
      {sizeOptions.map((size, i) => {
        return (
          <option
            key={i}
            value={size}
          >
          {size}
          </option>
        );
      })}
    </select>
  );
};

module.exports = GridSize;
