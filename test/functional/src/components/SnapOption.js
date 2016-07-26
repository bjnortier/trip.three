import React from 'react';

const SnapOption = ({ store, onSnapClick, label }) => {
  return (
    <label>
      <input
        type='checkbox'
        onClick={() => {
          onSnapClick(label);
        }}
        defaultChecked={store.getState()[label]}
      />
      {label}
    </label>
  );
};

export default SnapOption;
