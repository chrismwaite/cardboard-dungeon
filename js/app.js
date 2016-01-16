$(document).ready(function() {
    //create containers and starting rooms
    var container_far = new Container('#room-far');
    var container_middle = new Container('#room-middle');
    var container_near = new Container('#room-near');
    
    var room = new Room('{"top":1,"bottom":1,"left":1,"right":1,"back":1,"front":0}');
    
    container_far.room = room;
    container_far.position_multiplier = 0;
    container_far.render();

    var room2 = new Room('{"top":1,"bottom":1,"left":1,"right":1,"back":0,"front":0}');

    container_middle.room = room2;
    container_middle.position_multiplier = 4;
    container_middle.render();

    var room3 = new Room('{"top":1,"bottom":1,"left":1,"right":1,"back":0,"front":1}');

    container_near.room = room3;
    container_near.position_multiplier = 8;
    container_near.render();

    $( ".move" ).click(function() {
        this.setAttribute('material', 'color', 'red');
        console.log('I was clicked!');
    });

    //add event listener to arrow on ground

    //if arrow clicked

    //remove dom of room near

    //copy dom from room far to room middle and room middle to room near

    //generate new dom for room far
});

//Container Entity
function Container(target) {
    this.target = target;
    this.room = null;
    this.position_multiplier = 0;
}

Container.prototype.render = function() {
    //move room render function to here
    //depending on the wall position, apply the position_multiplier to the correct axis (x, y, z)
    if(this.room.data.top) {
        var entity = document.createElement('a-entity');
        entity.setAttribute('mixin','wall top');
        entity.setAttribute('position','0 4 ' + this.position_multiplier);
        $(this.target).append(entity);
    }

    if(this.room.data.bottom) {
        var entity = document.createElement('a-entity');
        entity.setAttribute('mixin','wall bottom');
        entity.setAttribute('position','0 0 ' + this.position_multiplier);
        $(this.target).append(entity);
    }

    if(this.room.data.left) {
        var entity = document.createElement('a-entity');
        entity.setAttribute('mixin','wall left');
        entity.setAttribute('position','-2 2 ' + this.position_multiplier);
        $(this.target).append(entity);
    }

    if(this.room.data.right) {
        var entity = document.createElement('a-entity');
        entity.setAttribute('mixin','wall right');
        entity.setAttribute('position','2 2 ' + this.position_multiplier);
        $(this.target).append(entity);
    }

    if(this.room.data.back) {
        var entity = document.createElement('a-entity');
        entity.setAttribute('mixin','wall back');
        entity.setAttribute('position','0 2 ' + (-2 + this.position_multiplier));
        $(this.target).append(entity);
    }

    if(this.room.data.front) {
        var entity = document.createElement('a-entity');
        entity.setAttribute('mixin','wall front');
        entity.setAttribute('position','0 2 ' + (2 + this.position_multiplier));
        $(this.target).append(entity);
    }

    //add the event listener for movement
    var entity = document.createElement('a-entity');
    entity.setAttribute('class','move');
    entity.setAttribute('mixin','move');
    entity.setAttribute('position','0 1 ' + this.position_multiplier);
    $(this.target).append(entity);
}

//Room Entity
function Room(data) {
    this.data = JSON.parse(data);
}