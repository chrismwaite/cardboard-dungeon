var containers = {};
var map = null;

$(document).ready(function() {
    //load data from map
    loadMapData("map.json");

    $(".move").click(function() {
        var move_to = $(this).parent().attr("id");

        var x_mod = 0;
        var y_mod = 0;

        if(move_to == "north") {
            y_mod = 1;
        }
        else if(move_to == "south") {
            y_mod = -1;
        }
        else if(move_to == "west") {
            x_mod = -1;
        }
        else if(move_to == "east") {
            x_mod = 1;
        }

        for (var key in containers) {
            var room_key_array = containers[key].room_id.split(",");
            room_key_array[0] = parseInt(room_key_array[0]) + x_mod;
            room_key_array[1] = parseInt(room_key_array[1]) + y_mod;
            var new_room_key = room_key_array.join(",");

            //console.log(key + " => moving from " + containers[key].room_id + " to " + new_room_key);

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
});

//Container Entity
function Container(target, room, room_id) {
    this.target = target;
    this.room = room;
    this.room_id = room_id;
}

Container.prototype.render = function() {
    //set the visible component on the room sides for this container
    if(this.room) {
        $(this.target).find(".top").attr("visible",(this.room.data.top ? this.room.data.top : "false"));
        $(this.target).find(".bottom").attr("visible",(this.room.data.bottom ? this.room.data.bottom : "false"));
        $(this.target).find(".left").attr("visible",(this.room.data.left ? this.room.data.left : "false"));
        $(this.target).find(".right").attr("visible",(this.room.data.right ? this.room.data.right : "false"));
        $(this.target).find(".back").attr("visible",(this.room.data.back ? this.room.data.back : "false"));
        $(this.target).find(".front").attr("visible",(this.room.data.front ? this.room.data.front : "false"));
    }
    else {
        $(this.target).find(".top").attr("visible","false");
        $(this.target).find(".bottom").attr("visible","false");
        $(this.target).find(".left").attr("visible","false");
        $(this.target).find(".right").attr("visible","false");
        $(this.target).find(".back").attr("visible","false");
        $(this.target).find(".front").attr("visible","false");
    }
}

//Room Entity
function Room(data) {
    this.data = data;
}

function loadMapData(map_name) {
    $.getJSON("js/" + map_name, function(data) {
        map = data;

        //create containers and load the starting rooms
        //0,0 is currently the starting point regardless of the map
        containers["north-north"] = new Container("#north-north",(map["0,2"] ? new Room(map["0,2"].data) : null),"0,2");
        containers["north-west"] = new Container("#north-west",(map["-1,1"] ? new Room(map["-1,1"].data) : null), "-1,1");
        containers["north"] = new Container("#north",(map["0,1"] ? new Room(map["0,1"].data) : null),"0,1");
        containers["north-east"] = new Container("#north-east",(map["1,1"] ? new Room(map["1,1"].data) : null),"1,1");
        containers["west-west"] = new Container("#west-west",(map["-2,0"] ? new Room(map["-2,0"].data) : null),"-2,0");
        containers["west"] = new Container("#west",(map["-1,0"] ? new Room(map["-1,0"].data) : null),"-1,0");
        containers["center"] = new Container("#center",(map["0,0"] ? new Room(map["0,0"].data) : null),"0,0");
        containers["east"] = new Container("#east",(map["1,0"] ? new Room(map["1,0"].data) : null),"1,0");
        containers["east-east"] = new Container("#east-east",(map["2,0"] ? new Room(map["2,0"].data) : null),"2,0");
        containers["south-west"] = new Container("#south-west",(map["-1,-1"] ? new Room(map["-1,-1"].data) : null),"-1,-1");
        containers["south"] = new Container("#south",(map["0,-1"] ? new Room(map["0,-1"].data) : null),"0,-1");
        containers["south-east"] = new Container("#south-east",(map["1,-1"] ? new Room(map["1,-1"].data) : null),"1,-1");
        containers["south-south"] = new Container("#south-south",(map["0,-2"] ? new Room(map["0,-2"].data) : null),"0,-2");

        //render the room data for the containers
        for (var key in containers) {
            containers[key].render();
        }
    });
}