import React, { PropTypes } from 'react';

const SnapOption = ({ label, isEnabled, onClick }) => {
  return (
    <label>
      <input
        type='checkbox'
        onClick={() => {
          onClick(label);
        }}
        defaultChecked={isEnabled}
      />
      {label}
    </label>
  );
};

SnapOption.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool.isRequired,
};

export default SnapOption;
