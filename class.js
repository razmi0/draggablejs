//---------------------------------------------------//
//
// Description: Class for creating draggable items in the DOM
// Author: razmio | https://github.com/razmi0
// Date: 02/04/2023
//
//---------------------------------------------------//

//---------------------------------------------------//
//
// Class methods : #setElement(), #isObject(), #mergeDeep() , #whatDevice(),
//                 #startMoving(), #whileMoving(), #endMoving(), #colors(),
//                  render()
//
//---------------------------------------------------//

//---------------------------------------------------//
//
//  The options object allows you to customize the element to be created.
//- Options are : the element type, the element classes,
//                the element id, the element inner text, a boolean
//                "random" that allow you to set random colors to the
//                element being created. If random is set to true, you can set
//                the opacity of the background color, the coefficient of
//                the color either lighter or darker of the border.
//
//---------------------------------------------------//

/**
 * @class Dragify - class for creating draggable items
 */

export default class Dragify {
  constructor(userOptions = {}, parent = document.querySelector("body")) {
    this.initial_X = 0;
    this.initial_Y = 0;
    this.moving = false;
    this.parent = parent;
    this.template = null;
    this.#whatDevice();
    this.#setOptions(userOptions);
    this.#setElement();
    this.#startMoving();
    this.#whileMoving();
    this.#endMoving();
  }

  /**
   * @description - Build the element attributes
   */

  #setElement() {
    this.element = document.createElement(this.options.elementType);
    this.element.id = this.options.elementId.toString();
    this.element.className = this.options.elementClass;
    this.element.textContent = this.options.elementText;
    this.#colors();
    this.element.style.position = "absolute";
    this.template = `
      <${this.options.elementType}
      id="${this.options.elementId}"
      class="${this.options.elementClass}"
      style="position: absolute; top: 0; left: 0;">
      ${this.options.elementText}
      </${this.options.elementType}>
    `;
  }

  /**
   * @description - Evaluate if item is an object. Used in #mergeDeep()
   * @param {*} item
   * @returns {boolean}
   */

  #isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }

  /**
   * @description - Recursively merge the default options object until all the user options object is merged
   *                and return the merged object to the constructor.
   * @param {Object} defaultOptions
   * @param  {...Object} userOptions
   * @returns {Object} merged object
   */

  #mergeDeep(defaultOptions, ...userOptions) {
    const source = userOptions.shift();
    console.log("1");
    if (this.#isObject(defaultOptions) && this.#isObject(source)) {
      console.log("2");
      for (const key in source) {
        console.log("3");
        if (this.#isObject(source[key])) {
          console.log("4");
          if (!defaultOptions[key]) {
            Object.assign(defaultOptions, { [key]: {} });
          }
          console.log("5");
          this.#mergeDeep(defaultOptions[key], source[key]);
        } else {
          console.log("6");
          Object.assign(defaultOptions, { [key]: source[key] });
        }
        console.log("7");
      }
      console.log("8");
    }
    console.log("9");
    return defaultOptions;
  }

  /**
   * @description - Set the options object. If the userOptions object is empty, the defaultOptions object will be used.
   *                If the userOptions object is not empty, the defaultOptions object will be merged with the userOptions object.
   *                The mergeDeep() method will recursively merge the defaultOptions object until all the userOptions object is merged.
   * @param {Object} userOptions
   */

  #setOptions(userOptions) {
    const defaultOptions = {
      elementType: "div",
      elementClass: "",
      elementId: Date.now() + Math.floor(Math.random() * 1000),
      elementText: "",
      colorRandom: true,
    };
    Object.keys(userOptions).length > 0
      ? (this.options = this.#mergeDeep(defaultOptions, userOptions))
      : (this.options = structuredClone(defaultOptions));
  }

  /**
   * @description - To detect if device support touch event, mouse event, #whatDevice() use a combination of
   *                navigator.userAgent.includes("mobile") and maxTouchPoints.
   *                It will postulate that if the device is a mobile device, it will not have a mouseEvent.
   *                Hybrid is not considered.
   * @returns {object} deviceType with appropriate events
   */

  #whatDevice() {
    let device = {
      type: null,
      touchEvent: null,
      events: {
        down: null,
        move: null,
        up: null,
      },
    };

    navigator.userAgent.includes("Mobile") && navigator.maxTouchPoints > 0
      ? (device.type = "touch")
      : (device.type = "mouse");
    device.type === "touch"
      ? (device.touchEvent = true)
      : (device.touchEvent = false);
    if (device.type === "touch") {
      device.events.down = "touchstart";
      device.events.move = "touchmove";
      device.events.up = "touchend";
    } else {
      device.events.down = "mousedown";
      device.events.move = "mousemove";
      device.events.up = "mouseup";
    }
    this.device = device;
  }

  /**
   * @description - listen to the start of the movement and call randomColors() if the item is not colored
   */

  #startMoving() {
    this.element.addEventListener(
      this.device.events.down,
      (e) => {
        this.element.initial_X = this.device.touchEvent
          ? e.touches[0].clientX
          : e.clientX;
        this.element.initial_Y = this.device.touchEvent
          ? e.touches[0].clientY
          : e.clientY;
        this.element.moving = true;
      },
      { passive: true }
    );
  }

  /**
   * @description - listen to the movement of the element and update the position
   */

  #whileMoving() {
    this.element.addEventListener(
      this.device.events.move,
      (e) => {
        if (this.element.moving) {
          let new_X = 0;
          let new_Y = 0;
          new_X = this.device.touchEvent ? e.touches[0].clientX : e.clientX;
          new_Y = this.device.touchEvent ? e.touches[0].clientY : e.clientY;
          this.element.style.top =
            this.element.offsetTop - (this.element.initial_Y - new_Y) + "px";
          this.element.style.left =
            this.element.offsetLeft - (this.element.initial_X - new_X) + "px";
          this.element.initial_X = new_X;
          this.element.initial_Y = new_Y;
        }
      },
      { passive: true }
    );
  }

  /**
   * @description - listen to the end of the movement
   */

  #endMoving() {
    this.element.addEventListener(
      this.device.events.up,
      () => {
        this.element.moving = false;
      },
      { passive: true }
    );
    this.element.addEventListener(
      "mouseleave",
      () => {
        this.element.moving = false;
      },
      { passive: true }
    );
  }

  /**
   * @description - set a random color to the item if the options.colorRandom is set to true
   *
   */

  #colors() {
    if (this.options.colorRandom) {
      let r = Math.floor(Math.random() * 255);
      let g = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);
      this.element.style.backgroundColor = `rgb(${r},${g},${b})`;
    }
  }

  /**
   * @description - render the item in the DOM
   */

  render() {
    this.parent.appendChild(this.element);
  }
}
