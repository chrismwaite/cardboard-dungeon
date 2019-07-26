AFRAME.registerComponent('room', {
  schema: {
    northWall: {type: 'boolean', default: true},
    eastWall: {type: 'boolean', default: true},
    southWall: {type: 'boolean', default: true},
    westWall: {type: 'boolean', default: true},
  },
  init: function() {
    let el = this.el;
    //floor
    el.appendChild(this.createWall({x: -90, y: 0, z: 0},null,'#000',true));
    //ceiling
    el.appendChild(this.createWall({x: 90, y: 180, z: 0},{x: 0, y: 4, z: 0},'#000',true));
    //north wall
    el.appendChild(this.createWall({x: 180, y: 180, z: 0},{x: 0, y: 2, z: -2},'#F00',this.data.northWall));
    //south wall
    el.appendChild(this.createWall({x: 180, y: 0, z: 0},{x: 0, y: 2, z: 2},'#FF0',this.data.southWall));
    //east wall
    el.appendChild(this.createWall({x: 180, y: 90, z: 0},{x: 2, y: 2, z: 0},'#0F0',this.data.eastWall));
    //west wall
    el.appendChild(this.createWall({x: 180, y: -90, z: 0},{x: -2, y: 2, z: 0},'#0F0',this.data.westWall));
  },
  update: function() {
    //handle what happens when an attribute is updated - e.g. northwall becomes false
  },
  createWall: function(rotation, position, colour, visibility) {
    const HEIGHT = 4;
    const WIDTH = 4;
    let wall = document.createElement('a-plane');
    wall.setAttribute('height', HEIGHT);
    wall.setAttribute('width', WIDTH);
    wall.setAttribute('rotation', rotation);
    wall.setAttribute('visible', visibility)
    if (position) {
      wall.setAttribute('position', position);
    }
    wall.setAttribute('color', colour);
    return wall;
  }
});