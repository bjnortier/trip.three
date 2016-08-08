const React = require('react');

const GridExtents = ({ extentsOptions, currentExtents, enabled, onChange }) => {
  let select;
  return (
    <select name='extents-sizes'
      disabled={!enabled}
      ref={node => select = node}
      onChange={() => {
        onChange(select.value);
      }}
      value={currentExtents}
    >
      {extentsOptions.map((size, i) => {
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

module.exports = GridExtents;
