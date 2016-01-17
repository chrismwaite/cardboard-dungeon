var containers = {};
var map = null;

$(document).ready(function() {

    //load data from map
    loadMapData();

    //create containers and starting rooms
    containers['north-north'] = new Container('#north-north','{"x":0,"y":0,"z":-4}',new Room(map['0,2'].data),'0,2');
    containers['north-west'] = new Container('#north-west','{"x":-4,"y":0,"z":0}',null, '-1,1');
    containers['north'] = new Container('#north','{"x":0,"y":0,"z":0}',new Room(map['0,1'].data),'0,1');
    containers['north-east'] = new Container('#north-east','{"x":4,"y":0,"z":0}',null,'1,1');
    containers['west-west'] = new Container('#west-west','{"x":-8,"y":0,"z":4}',null,'-2,0');
    containers['west'] = new Container('#west','{"x":-4,"y":0,"z":4}',new Room(map['-1,0'].data),'-1,0');
    containers['center'] = new Container('#center','{"x":0,"y":0,"z":4}',new Room(map['0,0'].data),'0,0');
    containers['east'] = new Container('#east','{"x":4,"y":0,"z":4}',new Room(map['1,0'].data),'1,0');
    containers['east-east'] = new Container('#east-east','{"x":8,"y":0,"z":4}',null,'2,0');
    containers['south-west'] = new Container('#south-west','{"x":-4,"y":0,"z":8}',null,'-1,-1');
    containers['south'] = new Container('#south','{"x":0,"y":0,"z":8}',new Room(map['0,-1'].data),'0,-1');
    containers['south-east'] = new Container('#south-east','{"x":4,"y":0,"z":8}',null,'1,-1');
    containers['south-south'] = new Container('#south-south','{"x":0,"y":0,"z":12}',new Room(map['0,-2'].data),'0,-2');
    
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
        entity.setAttribute('position',this.position_multipliers.x + ' 0.1 ' + this.position_multipliers.z);
        $(this.target).append(entity);

        $(entity).click(function() {
            this.setAttribute('material', 'color', 'red');
            console.log($(this).parent().attr('id'));
            var move_to = $(this).parent().attr('id');
            
            var x_mod = 0;
            var y_mod = 0;

            if(move_to == 'north') {
                y_mod = 1;
            }
            else if(move_to == 'south') {
                y_mod = -1;
            }
            else if(move_to == 'west') {
                x_mod = -1;
            }
            else if(move_to == 'east') {
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