import React from 'react';
import SnapOption from './SnapOption';
import GridSize from './GridSize';

const SnapSettings = ({ store, onSnapClick, onGridSizeChange }) => {
  return (
    <div>
      {['surface', 'edge', 'vertex', 'grid'].map((key) => {
        return (<SnapOption
          store={store}
          onSnapClick={onSnapClick}
          key={key}
          label={key}
        />);
      })}
      <GridSize
        store={store}
        onGridSizeChange={onGridSizeChange}
      />
    </div>
  );
};

export default SnapSettings;
