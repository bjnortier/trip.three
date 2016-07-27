import { connect } from 'react-redux';
import { toggleSnap , changeGridSize } from '../actions';
import SnapSettingsView from '../components/SnapSettingsView';

const mapStateToProps = (state) => {
  return {
    snappables: Object.keys(state.snappables).map(label => {
      return {
        label: label,
        isEnabled: state.snappables[label],
      };
    }),
    grid: {
      sizes: state.gridSizes,
      currentSize: state.gridSize,
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
