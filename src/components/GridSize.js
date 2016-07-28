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
    >
      {sizeOptions.map((size, i) => {
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

module.exports = GridSize;
