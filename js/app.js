var containers = {};

$(document).ready(function() {

    //we need a map object
    //a collection of rooms represents a map
    //the map needs to define how the rooms are linked (or else the rooms do - e.g. room north, east, south, west)


    //rooms
    var room = new Room('{"top":1,"bottom":1,"left":1,"right":1,"back":0,"front":0}');
    var room2 = new Room('{"top":1,"bottom":1,"left":0,"right":0,"back":0,"front":0}');
    var room3 = new Room('{"top":1,"bottom":1,"left":1,"right":1,"back":0,"front":0}');
    var room4 = new Room('{"top":1,"bottom":1,"left":1,"right":0,"back":1,"front":1}');
    var room5 = new Room('{"top":1,"bottom":1,"left":0,"right":1,"back":1,"front":1}');

    //create containers and starting rooms
    containers['room-far'] = new Container('#room-far','{"x":0,"y":0,"z":0}',room);
    containers['room-middle-left'] = new Container('#room-middle-left','{"x":-4,"y":0,"z":4}',room4);
    containers['room-middle'] = new Container('#room-middle','{"x":0,"y":0,"z":4}',room2);
    containers['room-middle-right'] = new Container('#room-middle-right','{"x":4,"y":0,"z":4}',room5);
    containers['room-near'] = new Container('#room-near','{"x":0,"y":0,"z":8}',room3);
    
    //render the room data for the containers
    for (var key in containers) {
        containers[key].render();
    }

    //remove dom of room near

    //copy dom from room far to room middle and room middle to room near

    //generate new dom for room far
});

//Container Entity
function Container(target, multipliers, room) {
    this.target = target;
    this.room = room;
    this.position_multipliers = JSON.parse(multipliers);
}

Container.prototype.render = function() {
    //remove any existing dom
    $(this.target).empty();

    if(this.room) {
        if(this.room.data.top) {
            var entity = document.createElement('a-entity');
            entity.setAttribute('mixin','wall top');
            entity.setAttribute('position',this.position_multipliers.x + ' 4 ' + this.position_multipliers.z);
            $(this.target).append(entity);
        }

        if(this.room.data.bottom) {
            var entity = document.createElement('a-entity');
            entity.setAttribute('mixin','wall bottom');
            entity.setAttribute('position',this.position_multipliers.x + ' 0 ' + this.position_multipliers.z);
            $(this.target).append(entity);
        }

        if(this.room.data.left) {
            var entity = document.createElement('a-entity');
            entity.setAttribute('mixin','wall left');
            entity.setAttribute('position',(-2 + this.position_multipliers.x) + ' 2 ' + this.position_multipliers.z);
            $(this.target).append(entity);
        }

        if(this.room.data.right) {
            var entity = document.createElement('a-entity');
            entity.setAttribute('mixin','wall right');
            entity.setAttribute('position',(2 + this.position_multipliers.x) + ' 2 ' + this.position_multipliers.z);
            $(this.target).append(entity);
        }

        if(this.room.data.back) {
            var entity = document.createElement('a-entity');
            entity.setAttribute('mixin','wall back');
            entity.setAttribute('position',this.position_multipliers.x + ' 2 ' + (-2 + this.position_multipliers.z));
            $(this.target).append(entity);
        }

        if(this.room.data.front) {
            var entity = document.createElement('a-entity');
            entity.setAttribute('mixin','wall front');
            entity.setAttribute('position',this.position_multipliers.x + ' 2 ' + (2 + this.position_multipliers.z));
            $(this.target).append(entity);
        }

        //add the movement target for the container
        var entity = document.createElement('a-entity');
        entity.setAttribute('class','move');
        entity.setAttribute('mixin','move');
        entity.setAttribute('position',this.position_multipliers.x + ' 1 ' + this.position_multipliers.z);
        $(this.target).append(entity);

        $(entity).click(function() {
            this.setAttribute('material', 'color', 'red');
            console.log($(this).parent().attr('id'));
            var temp_container = containers[$(this).parent().attr('id')];
            var temp_room = new Room('{"top":1,"bottom":1,"left":0,"right":0,"back":1,"front":0}');
            temp_container.room = temp_room;
            temp_container.render();
        });
    }
}

//Room Entity
function Room(data) {
    this.data = JSON.parse(data);
}