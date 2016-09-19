const React = require('react');
const SnapOption = require('./SnapOption');
const GridSize = require('./GridSize');
const GridExtents = require('./GridExtents');

const SnapControls = ({ snappables, grid, onSnapClick, onGridSizeChange, onGridExtentsChange }) => {
  return (
    <div>
      {snappables.map(snappable => {
        return (<SnapOption
          key={snappable.label}
          {...snappable}
          onClick={() => onSnapClick(snappable.label)}
        />);
      })}
      <label>size:
        <GridSize
          {...grid}
          onChange={onGridSizeChange}
        />
      </label>
      <label>extents:</label>
      <GridExtents
        {...grid}
        onChange={onGridExtentsChange}
      />
    </div>
  );
};

module.exports = SnapControls;
