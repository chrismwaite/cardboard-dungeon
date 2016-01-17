var containers = {};
var map = null;

$(document).ready(function() {

    //load data from map
    loadMapData();

    //create containers and starting rooms
    containers['room-far-left'] = new Container('#room-far-left','{"x":-4,"y":0,"z":0}',null, '-1,1');
    containers['room-far'] = new Container('#room-far','{"x":0,"y":0,"z":0}',new Room(map['0,1'].data),'0,1');
    containers['room-far-right'] = new Container('#room-far-right','{"x":4,"y":0,"z":0}',null,'1,1');
    containers['room-middle-left'] = new Container('#room-middle-left','{"x":-4,"y":0,"z":4}',new Room(map['-1,0'].data),'-1,0');
    containers['room-middle'] = new Container('#room-middle','{"x":0,"y":0,"z":4}',new Room(map['0,0'].data),'0,0');
    containers['room-middle-right'] = new Container('#room-middle-right','{"x":4,"y":0,"z":4}',new Room(map['1,0'].data),'1,0');
    containers['room-near-left'] = new Container('#room-near-left','{"x":-4,"y":0,"z":8}',null,'-1,-1');
    containers['room-near'] = new Container('#room-near','{"x":0,"y":0,"z":8}',new Room(map['0,-1'].data),'0,-1');
    containers['room-near-right'] = new Container('#room-near-right','{"x":4,"y":0,"z":8}',null,'1,-1');
    
    //render the room data for the containers
    for (var key in containers) {
        containers[key].render();
    }
});

//Container Entity
function Container(target, multipliers, room, room_id) {
    this.target = target;
    this.room = room;
    this.position_multipliers = JSON.parse(multipliers);
    this.room_id = room_id;
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
            var move_to = $(this).parent().attr('id');
            
            var x_mod = 0;
            var y_mod = 0;

            if(move_to == 'room-far') {
                y_mod = 1;
            }
            else if(move_to == 'room-near') {
                y_mod = -1;
            }
            else if(move_to == 'room-middle-left') {
                x_mod = -1;
            }
            else if(move_to == 'room-middle-right') {
                x_mod = 1;
            }

            for (var key in containers) {
                var room_key_array = containers[key].room_id.split(',');
                room_key_array[0] = parseInt(room_key_array[0]) + x_mod;
                room_key_array[1] = parseInt(room_key_array[1]) + y_mod;
                var new_room_key = room_key_array.join(',');

                console.log(key + ' => moving from ' + containers[key].room_id + ' to ' + new_room_key);

                if(map[new_room_key])
                {
                    containers[key].room = new Room(map[new_room_key].data);
                    containers[key].room_id = new_room_key;
                    containers[key].render();
                }
                else {
                    containers[key].room = null;
                    containers[key].room_id = new_room_key;
                    containers[key].render();
                }
            }
        });
    }
}

//Room Entity
function Room(data) {
    this.data = data;
}

function loadMapData() {
    /*$.getJSON('map.json', function(data) {         
        map = JSON.parse(data);
    });*/
    var data = '{ "0,2":{ "data":{"top":1,"bottom":1,"left":1,"right":0,"back":1,"front":0} }, "1,2":{ "data":{"top":1,"bottom":1,"left":0,"right":0,"back":1,"front":1} }, "2,2":{ "data":{"top":1,"bottom":1,"left":0,"right":1,"back":1,"front":1} }, "0,1":{ "data":{"top":1,"bottom":1,"left":1,"right":1,"back":0,"front":0} }, "-1,0":{ "data":{"top":1,"bottom":1,"left":1,"right":0,"back":1,"front":1} }, "0,0":{ "data":{"top":1,"bottom":1,"left":0,"right":0,"back":0,"front":0} }, "1,0":{ "data":{"top":1,"bottom":1,"left":0,"right":1,"back":1,"front":1} }, "0,-1":{ "data":{"top":1,"bottom":1,"left":1,"right":1,"back":0,"front":0} }, "-2,-2":{ "data":{"top":1,"bottom":1,"left":1,"right":0,"back":1,"front":1} }, "-1,-2":{ "data":{"top":1,"bottom":1,"left":0,"right":0,"back":1,"front":1} }, "0,-2":{ "data":{"top":1,"bottom":1,"left":0,"right":0,"back":0,"front":1} }, "1,-2":{ "data":{"top":1,"bottom":1,"left":0,"right":1,"back":1,"front":1} } }';
    map = JSON.parse(data);
}