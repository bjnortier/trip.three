const connect = require('react-redux').connect;
const actions = require('../actions');
const { toggleSnap , changeGridSize } = actions;
const SnapSettingsView = require('../components/SnapSettingsView');

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
  };
};

const SnapSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(SnapSettingsView);

export default SnapSettings;
