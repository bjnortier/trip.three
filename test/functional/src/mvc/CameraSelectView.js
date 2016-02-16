var trip = require('../../../..');
var DOMView = trip.views.DOMView;

class CameraSelectView extends DOMView {

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
      'click [value="perspective"]': 'toPerspective',
      'click [value="xaxis"]': 'toXAxis',
      'click [value="yaxis"]': 'toYAxis',
      'click [value="zaxis"]': 'toZAxis',
    };
  }

}

module.exports = CameraSelectView;
