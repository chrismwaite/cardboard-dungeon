var containers = {};

$(document).ready(function() {
    //rooms
    var room = new Room('{"top":1,"bottom":1,"left":1,"right":1,"back":0,"front":0}');
    var room2 = new Room('{"top":1,"bottom":1,"left":1,"right":1,"back":0,"front":0}');
    var room3 = new Room('{"top":1,"bottom":1,"left":1,"right":1,"back":0,"front":0}');

    //create containers and starting rooms
    containers['room-far'] = new Container('#room-far',0,room);
    containers['room-middle'] = new Container('#room-middle',4,room2);
    containers['room-near'] = new Container('#room-near',8,room3);
    
    //render the room data for the containers
    for (var key in containers) {
        containers[key].render();
    }

    //remove dom of room near

    //copy dom from room far to room middle and room middle to room near

    //generate new dom for room far
});

//Container Entity
function Container(target, multiplier, room) {
    this.target = target;
    this.room = room;
    this.position_multiplier = multiplier;
}

Container.prototype.render = function() {
    //remove any existing dom
    $(this.target).empty();

    if(this.room) {
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

        //add the movement target for the container
        var entity = document.createElement('a-entity');
        entity.setAttribute('class','move');
        entity.setAttribute('mixin','move');
        entity.setAttribute('position','0 1 ' + this.position_multiplier);
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