import React from 'react';
import SnapOption from './SnapOption';
import GridSize from './GridSize';

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
