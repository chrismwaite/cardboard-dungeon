AFRAME.registerComponent('level', {
  schema: {
    levelData: {type: 'string', deafult: ''}
  },
  init: function() {
    //generate empty space to procedurally mine
    this.generateGrid(5,5);

    //store in a string
    const levelData = { 
      '0,0': 1,

     }


    //update the room system or maybe the room system communicates with the level system
  },
  update: function() {
  },
  generateGrid: function(widthX, widthY) {
    //0,0 is always the center
    //from the provide info, i need to return a string of references with a 0 value assigned (a space with no room)
    let levelData = {}
    
  }
});