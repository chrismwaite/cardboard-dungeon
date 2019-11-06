//require('aframe');
require('./components/room.js');
require('./components/level.js');

//alert("test");

//its possible to create my own aframe html primitives - so i could have a room primitve? and a world (or a floor/level as in floor 1 of dungeon) primitivee?

//all primitives are entities with preset components and values so they are like prefabs
//Have a semantic name (e.g., <a-box>)
//Have a preset bundle of components with default values
//Map or proxy HTML attributes to component data

//custom entities useing custom code would require a custom component containing the logic
//so a level entity would require a level component i think which contained the logic

//actually a-frame has the concept of systems so we limit components to data and/or small funcs

//entity = a-entity
//custom entity = a=entity + components + default values
//custom component = data and logic
//system = logic to use component data if required - may get away with components unless overarching systems are required

//i need to investigate the default components for touch controls and grabbing etc as there seem to be defaults theses days

//can use built in dom events - e.g ball.emit('collided')
//and then listen for those events

//For building VR applications, we recommend placing all application code within components (and systems). An ideal A-Frame codebase consists purely of modular, encapsulated, and decoupled components. These components can be unit tested in isolation or alongside other components.

//THIS SECTION EXPLAINS THAT CODE SHOULD BE IN COMPONENTS: https://aframe.io/docs/0.9.0/introduction/javascript-events-dom-apis.html
//could always have a tope level component attached to the scene, an empty entity or a system
//js testing framework needed

//dont use Jquery, just JS

//this is a good point as could grab all entities with a specific component - e.g. in a system
//[] is attribute selector just as # is id and . is class
//var els = sceneEl.querySelectorAll('[light]');
//for (var i = 0; i < els.length; i++) {
//  console.log(els[i]);
//}

/*

A Note About Performance
Avoid using .querySelector and .querySelectorAll in tick and tock functions that get called every frame as it does take some time to loop over the DOM to retrieve entities. Instead, keep a cached list of entities, calling the query selectors beforehand, and then just loop over that.

AFRAME.registerComponent('query-selector-example', {
  init: function () {
    this.entities = document.querySelectorAll('.box');
  },
  
  tick: function () {
    // Don't call query selector in here, query beforehand.
    for (let i = 0; i < this.entities.length; i++) {
      // Do something with entities.
    }
  }
});

*/