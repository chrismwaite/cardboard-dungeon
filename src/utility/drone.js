let Drone = function(x, y, life, maxX, maxY) {
  this.x = x;
  this.y = y;
  this.maxX = maxX;
  this.maxY = maxY;
  this.life = life;
};

Drone.prototype = {
  mine: function(grid) {
    //console.log('test');
    //determine direction to mine and generate reference
    switch(Math.floor((Math.random() * 4) + 1)) {
      //north
      case 1:
        this.y+1 <= this.maxY ? this.y+=1 : this.y=this.y;
        break;
      //east
      case 2:
        this.x+1 <= this.maxX ? this.x+=1 : this.x=this.x;
        break;
      //south
      case 3:
        //this.row+1 <= rows ? this.row+=1 : this.row=this.row;
        this.y-1 >= 0 ? this.y-=1 : this.y=this.y;
        break;
      //west
      case 4:
      this.x-=1 >= 0 ? this.x-=1 : this.x=this.x;
        break;
    }
    let coord = `${this.x},${this.y}`;
    grid[coord] = 1;
    //update position to new coordinate
    //this.x = ;
    //this.y = ;
    this.life--;
    return grid;
  }
};

module.exports = Drone;