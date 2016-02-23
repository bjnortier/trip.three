var tripdom = require('trip.dom');

class CameraSelectView extends tripdom.View {

  constructor(model, scene) {
    super(model, scene);
  }

  render() {
    let template = `
      <input type="button" value="perspective"><br>
      <input type="button" value="x+"><input type="button" value="x-"><br>
      <input type="button" value="y+"><input type="button" value="y-"><br>
      <input type="button" value="z+"><input type="button" value="z-"><br>
      <input type="button" value="zoom to extents"><br>
    `;
    this.toHtml(template, {});
  }

  events() {
    return {
      'click [value="perspective"]': 'perspective',
      'click [value="x+"]': 'x+',
      'click [value="x-"]': 'x-',
      'click [value="y+"]': 'y+',
      'click [value="y-"]': 'y-',
      'click [value="z+"]': 'z+',
      'click [value="z-"]': 'z-',
      'click [value="zoom to extents"]': 'zoomToExtents',
    };
  }

}

module.exports = CameraSelectView;
