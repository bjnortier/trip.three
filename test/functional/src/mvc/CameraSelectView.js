var tripdom = require('trip.dom');

class CameraSelectView extends tripdom.View {

  constructor(model, scene) {
    super(model, scene);
  }

  render() {
    let template = `
      <input type="button" value="perspective"><br>
      <input type="button" value="xaxis"><br>
      <input type="button" value="yaxis"><br>
      <input type="button" value="zaxis"><br>
    `;
    this.toHtml(template, {});
  }

  events() {
    return {
      'click [value="perspective"]': 'clickPerspective',
      'click [value="xaxis"]': 'clickXAxis',
      'click [value="yaxis"]': 'clickYAxis',
      'click [value="zaxis"]': 'clickZAxis',
    };
  }

}

module.exports = CameraSelectView;
