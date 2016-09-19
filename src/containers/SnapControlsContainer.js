const connect = require('react-redux').connect;
const actions = require('../actions');
const { toggleSnap , changeGridSize, changeGridExtents } = actions;
const SnapControls = require('../components/SnapControls');

const mapStateToProps = (state) => {
  return {
    snappables: Object.keys(state.snappables).map(label => {
      return {
        label: label,
        isEnabled: state.snappables[label],
      };
    }),
    grid: {
      sizeOptions: state.grid.sizeOptions,
      currentSize: state.grid.size,
      extentsOptions: state.grid.extentsOptions,
      currentExtents: state.grid.extents,
      enabled: state.snappables.grid,
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSnapClick: (label) => {
      dispatch(toggleSnap(label));
    },
    onGridSizeChange: (size) => {
      dispatch(changeGridSize(size));
    },
    onGridExtentsChange: (size) => {
      dispatch(changeGridExtents(size));
    },
  };
};

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SnapControls);
