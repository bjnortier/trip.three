import React from 'react';

const SnapSettings = ({ store, onSnapClick }) => {
  return (
    <div>
      <label>
        <input
          type='checkbox'
          onClick={() => {
            onSnapClick('surface');
          }}
          defaultChecked={store.getState().surface}
        />
        surface
      </label>
      <label>
        <input
          type='checkbox'
          onClick={() => {
            onSnapClick('edge');
          }}
          defaultChecked={store.getState().edge}
        />
        edge
      </label>
      <label>
        <input
          type='checkbox'
          onClick={() => {
            onSnapClick('vertex');
          }}
          defaultChecked={store.getState().vertex}
        />
        vertex
      </label>
      <label>
        <input
          type='checkbox'
          onClick={() => {
            onSnapClick('grid');
          }}
          defaultChecked={store.getState().grid}
        />
        grid
      </label>
    </div>
  );
};

export default SnapSettings;
