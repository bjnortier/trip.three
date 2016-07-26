import React from 'react';
import SnapSettings from '../components/SnapSettings';

const App = ({store, onSnapClick}) => {
  return (
    <SnapSettings
      store={store}
      onSnapClick={onSnapClick}
    />
  );
};

export default App;
