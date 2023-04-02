//---------------------------------------------------//
//
// Description: Class for creating draggable items in the DOM
// Author: razmio | https://github.com/razmi0
// Date: 02/04/2023
//
//---------------------------------------------------//

//---------------------------------------------------//
//
// Class methods : #ItemElement(), #isObject(), #mergeDeep() , whatDevice(),
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
  constructor(parent = document.querySelector("body"), options = {}) {
    const defaultOptions = {
      elementType: "div",
      elementClass: '',
      elementId: Date.now() + Math.floor(Math.random() * 1000),
      elementText: "",
      elementColor: {
        random: true,
        colorEdge: {
          opacity: 1,
          coefficient: 1,
          darker: true,
        },
      },
    };
    this.initial_X = 0;
    this.initial_Y = 0;
    this.moving = false;
    !Object.keys(options).length
      ? (this.options = defaultOptions)
      : (this.options = this.#mergeDeep(defaultOptions, options));
    this.parent = parent;
    this.device = this.whatDevice();
    this.element = document.createElement(this.options.elementType);
    this.#itemElement();
    this.#startMoving();
    this.#whileMoving();
    this.#endMoving();
  }

  /**
   * @description - Build the element attributes
   * @param {HTMLElement} element
   * @param {object} this.options
   */

  #itemElement() {
    this.element.id = this.options.elementId;
    this.element.className = this.options.elementClass;
    this.element.textContent = this.options.elementText;
    if (this.options.elementColor.random) {
      this.#colors();
    }
    this.element.style.position = "absolute";
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
   * @param {Object} options 
   * @param  {...Object} defaultOptions
   * @returns {Object} merged object
   */
  #mergeDeep(options, ...defaultOptions) {
    const source = defaultOptions.shift();
    if (this.#isObject(options) && this.#isObject(source)) {
      for (const key in source) {
        if (this.#isObject(source[key])) {
          if (!options[key]) {
            Object.assign(options, { [key]: {} })
          };
          this.#mergeDeep(options[key], source[key]);
        }
        else {
          Object.assign(options, { [key]: source[key] });
        }
      }
    }
    return options;
  }

  /**
   * @description - To detect if device support touch event, mouse event, whatDevice() use a combination of
   *                navigator.userAgent.includes("mobile") and maxTouchPoints.
   *                It will postulate that if the device is a mobile device, it will not have a mouseEvent.
   *                Hybrid is not considered.
   * @returns {object} deviceType with appropriate events
   */

  whatDevice() {
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
    return device;
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
    this.element.addEventListener(this.device.events.up, () => {
      this.element.moving = false;
    });
  }

  /**
   * @description - set a random color to the item if the options.elementColor.random is set to true
   * @param {object} this.options
   */

  #colors() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    let a = this.options.elementColor.colorEdge.opacity;
    if (this.options.elementColor.colorEdge.darker) {
      r = r * this.options.elementColor.colorEdge.coefficient;
      g = g * this.options.elementColor.colorEdge.coefficient;
      b = b * this.options.elementColor.colorEdge.coefficient;
      a = a * this.options.elementColor.colorEdge.coefficient;
      this.element.style.borderColor = `rgb(${r},${g},${b},${a})`;
    }
    this.element.style.backgroundColor = `rgb(${r},${g},${b},${a})`;
  }

  /**
   * @description - render the item in the DOM
   */

  render() {
    this.parent.appendChild(this.element);
  }
}
