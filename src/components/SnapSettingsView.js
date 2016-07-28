const React = require('react');
const SnapOption = require('./SnapOption');
const GridSize = require('./GridSize');

const SnapSettings = ({ snappables, grid, onSnapClick, onGridSizeChange }) => {
  return (
    <div>
      {snappables.map(snappable => {
        return (<SnapOption
          key={snappable.label}
          {...snappable}
          onClick={() => onSnapClick(snappable.label)}
        />);
      })}
      <GridSize
        {...grid}
        onChange={onGridSizeChange}
      />
    </div>
  );
};

export default SnapSettings;
