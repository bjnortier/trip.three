'use strict';

const tripdom = require('trip.dom');
const Text = tripdom.Text;

class CoordinatesDOMView extends tripdom.View {

  constructor(model, scene, options) {
    super(model, scene, options);
    this.field = options.field;
  }

  render() {
    let template = `
      <div class="x">{{{x}}}</div>
      <div class="y">{{{y}}}</div>
      <div class="z">{{{z}}}</div>
      `;
    let view = {
      x: new Text(this.model, this.field + 'X'),
      y: new Text(this.model, this.field + 'Y'),
      z: new Text(this.model, this.field + 'Z'),
    };
    this.toHtml(template, view);
  }

  update() {

  }

}

module.exports = CoordinatesDOMView;
