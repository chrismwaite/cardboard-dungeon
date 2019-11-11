let Drone = require('../utility/drone.js');

AFRAME.registerComponent('level', {
  schema: {
    maxX: {type: 'int', default: 5},
    maxY: {type: 'int', default: 5}
  },
  init: function() {
    console.log('level component');
    let el = this.el;

    //generate empty space to procedurally mine
    let grid = this.generateGrid(this.data.maxX,this.data.maxY);

    console.log(grid);

    //mine the data to create the rooms
    this.levelData = this.mineData(grid);

    console.log(this.levelData);

    //build the level
    this.buildLevel(el, this.levelData);

    //parse the level data to generate the rooms
    //update the room system or maybe the room system communicates with the level system
  },
  update: function() {
  },
  generateGrid: function(widthX, widthY) {
    //0,0 is always the center
    //from the provide info, i need to return a string of references with a 0 value assigned (a space with no room)
    //or maybe this doesnt matter and 0 can be top left?
    //starting position is likely random anyway
    let levelData = {
      //room coordinates: 'x,y'
      //no room or room: 0 or 1   
      //'0,0': 1,
    };
    let x=0;
    let y=0;

    for(let i=0; i<(widthX*widthY); i++) {
      if(y % widthY == 0 && y!=0) {
        x++;
        y=0;
      }
      let coord = `${x},${y}`;
      levelData[coord] = 0;
      y++;
    }

    return levelData;
  },
  mineData: function(grid) {
    let newGrid = grid;
    //spawn mining drones - 1 for now
    let drones = [];
    drones.push(new Drone(0,0,10,this.data.maxX,this.data.maxY));

    drones.forEach(drone => {
      while(drone.life > 0) {
        newGrid = drone.mine(newGrid);
      }
    });

    return newGrid;
    
  },
  buildLevel: function(el, levelData) {
    //loop level data and create rooms
    //level data is:
    //1,0 1,1 1,2 1,3
    //0,0 0,1 0,2 0,3
    //0,0 = {x: 0, y: 0, z: 0}
    //1,0 is north by 1 room so {x: 0, y: 0, z: -4}
    //see index html file for more mappings
    //algo needed to convert
    let room = document.createElement('a-entity');
    room.setAttribute('room', 'northWall: false; southWall:false; eastWall: false; westWall: false');
    room.setAttribute('position', {x: 0, y: 0, z: 0});
    el.appendChild(room);
  }
});