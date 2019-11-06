AFRAME.registerComponent('room', {
  schema: {
    northWall: {type: 'boolean', default: true},
    eastWall: {type: 'boolean', default: true},
    southWall: {type: 'boolean', default: true},
    westWall: {type: 'boolean', default: true},
  },
  init: function() {
    let el = this.el;

    //store the wall elements
    this.walls = {};

    //floor
    this.createWall(el,'floor',{x: -90, y: 0, z: 0},null,'#000',true);
    //ceiling
    this.createWall(el,'ceiling',{x: 90, y: 180, z: 0},{x: 0, y: 4, z: 0},'#000',true);
    //north wall
    this.createWall(el,'northWall',{x: 180, y: 180, z: 0},{x: 0, y: 2, z: -2},'#F00',this.data.northWall);
    //south wall
    this.createWall(el,'southWall',{x: 180, y: 0, z: 0},{x: 0, y: 2, z: 2},'#FF0',this.data.southWall);
    //east wall
    this.createWall(el,'eastWall',{x: 180, y: 90, z: 0},{x: 2, y: 2, z: 0},'#0F0',this.data.eastWall);
    //west wall
    this.createWall(el,'westWall',{x: 180, y: -90, z: 0},{x: -2, y: 2, z: 0},'#0F0',this.data.westWall);
  },
  update: function(oldData) {
    let el = this.el;
    let data = this.data;

    if(data.northWall !== oldData.northWall) { this.walls['northWall'].setAttribute('visible',data.northWall); }
    if(data.southWall !== oldData.southWall) { this.walls['southWall'].setAttribute('visible',data.northWall); }
    if(data.eastWall !== oldData.eastWall) { this.walls['eastWall'].setAttribute('visible',data.northWall); }
    if(data.westWall !== oldData.westWall) { this.walls['westWall'].setAttribute('visible',data.northWall); }
  },
  createWall: function(el, name, rotation, position, colour, visibility) {
    const HEIGHT = 4;
    const WIDTH = 4;
    let wall = document.createElement('a-plane');
    wall.setAttribute('class', name);
    wall.setAttribute('height', HEIGHT);
    wall.setAttribute('width', WIDTH);
    wall.setAttribute('rotation', rotation);
    wall.setAttribute('visible', visibility)
    if (position) {
      wall.setAttribute('position', position);
    }
    wall.setAttribute('color', colour);
    el.appendChild(wall);
    this.walls[name] = wall;
  }
});