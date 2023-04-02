//test project for Dragify

import Dragify from '/class.js';

const options = {
    elementClass : 'my-class select blabla',
    elementId : 'my-ID',
    elementColor: {
        random: false,
        colorEdge: {
            darker: false,
        }
    },
};

const parent = document.querySelector('section');

const element = new Dragify(parent);
console.log(element);
element.render();
