import React from 'react';
import SnapSettings from '../components/SnapSettings';

const App = ({store, onSnapClick, onGridSizeChange}) => {
  return (
    <SnapSettings
      store={store}
      onSnapClick={onSnapClick}
      onGridSizeChange={onGridSizeChange}
    />
  );
};

export default App;
