//---------------------------//
//Test project for Dragify
//---------------------------//

import Dragify from '/draggablejs/class.js';

const options = {
  elementClass: "parent",
  elementText: "Parent",
};

const defaultOptions = {
  elementType: "div",
  elementClass: "",
  elementId: Date.now() + Math.floor(Math.random() * 1000),
  elementText: "",
  colorRandom: true
};
const element = new Dragify(options);
element.render();
console.trace(element);

