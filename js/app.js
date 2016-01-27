var containers = {};
var map = null;

$(document).ready(function() {
    //load data from map
    loadMapData("map.json");

    $(".move").click(function() {
        var move_to = $(this).parent().attr("id");

        var x_mod = 0;
        var y_mod = 0;
        var z_mod = 0;

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

        //TEMP - we're doing a quick check to see if the target room has a floor
        //if not, we're dropping a level
        //eventually this should be a separate click target for climbing
        var temp_room_key_array = containers["center"].room_id.split(",");
        temp_room_key_array[0] = parseInt(temp_room_key_array[0]) + x_mod;
        temp_room_key_array[1] = parseInt(temp_room_key_array[1]) + y_mod;
        temp_room_key_array[2] = parseInt(temp_room_key_array[2]) + z_mod;
        var temp_key = temp_room_key_array.join(",");
        
        console.log("Target key: " + temp_key);
        
        if(map[temp_key] && map[temp_key].data.bottom == false) {
            z_mod = -1;
        }

        //END OF TEMP

        for (var key in containers) {
            var room_key_array = containers[key].room_id.split(",");
            room_key_array[0] = parseInt(room_key_array[0]) + x_mod;
            room_key_array[1] = parseInt(room_key_array[1]) + y_mod;
            room_key_array[2] = parseInt(room_key_array[2]) + z_mod;
            var new_room_key = room_key_array.join(",");

            console.log(key + " => moving from " + containers[key].room_id + " to " + new_room_key);

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
function Container(target, multipliers, room, room_id) {
    this.target = target;
    this.position_multipliers = JSON.parse(multipliers);
    this.room = room;
    this.room_id = room_id;
    //generate entity markup
    this.init();
}

Container.prototype.init = function() {
    var entity = document.createElement("a-entity");
    entity.setAttribute("class","top");
    entity.setAttribute("mixin","wall top");
    entity.setAttribute("visible","false");
    entity.setAttribute("position",this.position_multipliers.x + " " + (4 + this.position_multipliers.y) + " " + this.position_multipliers.z);
    $(this.target).append(entity);

    var entity = document.createElement("a-entity");
    entity.setAttribute("class","bottom");
    entity.setAttribute("mixin","wall bottom");
    entity.setAttribute("visible","false");
    entity.setAttribute("position",this.position_multipliers.x + " " + this.position_multipliers.y + " " + this.position_multipliers.z);
    $(this.target).append(entity);

    var entity = document.createElement("a-entity");
    entity.setAttribute("class","left");
    entity.setAttribute("mixin","wall left");
    entity.setAttribute("visible","false");
    entity.setAttribute("position",(-2 + this.position_multipliers.x) + " " + (2 + this.position_multipliers.y) + " " + this.position_multipliers.z);
    $(this.target).append(entity);

    var entity = document.createElement("a-entity");
    entity.setAttribute("class","right");
    entity.setAttribute("mixin","wall right");
    entity.setAttribute("visible","false");
    entity.setAttribute("position",(2 + this.position_multipliers.x) + " " + (2 + this.position_multipliers.y) + " " + this.position_multipliers.z);
    $(this.target).append(entity);

    var entity = document.createElement("a-entity");
    entity.setAttribute("class","back");
    entity.setAttribute("mixin","wall back");
    entity.setAttribute("visible","false");
    entity.setAttribute("position",this.position_multipliers.x + " " + (2 + this.position_multipliers.y) + " " + (-2 + this.position_multipliers.z));
    $(this.target).append(entity);

    var entity = document.createElement("a-entity");
    entity.setAttribute("class","front");
    entity.setAttribute("mixin","wall front");
    entity.setAttribute("visible","false");
    entity.setAttribute("position",this.position_multipliers.x + " " + (2 + this.position_multipliers.y) + " " + (2 + this.position_multipliers.z));
    $(this.target).append(entity);
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

        //ground floor
        containers["north-north"] = new Container("#north-north","{\"x\":0,\"y\":0,\"z\":-4}",(map["0,2,0"] ? new Room(map["0,2,0"].data) : null),"0,2,0");
        containers["north-west"] = new Container("#north-west","{\"x\":-4,\"y\":0,\"z\":0}",(map["-1,1,0"] ? new Room(map["-1,1,0"].data) : null), "-1,1,0");
        containers["north"] = new Container("#north","{\"x\":0,\"y\":0,\"z\":0}",(map["0,1,0"] ? new Room(map["0,1,0"].data) : null),"0,1,0");
        containers["north-east"] = new Container("#north-east","{\"x\":4,\"y\":0,\"z\":0}",(map["1,1,0"] ? new Room(map["1,1,0"].data) : null),"1,1,0");
        containers["west-west"] = new Container("#west-west","{\"x\":-8,\"y\":0,\"z\":4}",(map["-2,0,0"] ? new Room(map["-2,0,0"].data) : null),"-2,0,0");
        containers["west"] = new Container("#west","{\"x\":-4,\"y\":0,\"z\":4}",(map["-1,0,0"] ? new Room(map["-1,0,0"].data) : null),"-1,0,0");
        containers["center"] = new Container("#center","{\"x\":0,\"y\":0,\"z\":4}",(map["0,0,0"] ? new Room(map["0,0,0"].data) : null),"0,0,0");
        containers["east"] = new Container("#east","{\"x\":4,\"y\":0,\"z\":4}",(map["1,0,0"] ? new Room(map["1,0,0"].data) : null),"1,0,0");
        containers["east-east"] = new Container("#east-east","{\"x\":8,\"y\":0,\"z\":4}",(map["2,0,0"] ? new Room(map["2,0,0"].data) : null),"2,0,0");
        containers["south-west"] = new Container("#south-west","{\"x\":-4,\"y\":0,\"z\":8}",(map["-1,-1,0"] ? new Room(map["-1,-1,0"].data) : null),"-1,-1,0");
        containers["south"] = new Container("#south","{\"x\":0,\"y\":0,\"z\":8}",(map["0,-1,0"] ? new Room(map["0,-1,0"].data) : null),"0,-1,0");
        containers["south-east"] = new Container("#south-east","{\"x\":4,\"y\":0,\"z\":8}",(map["1,-1,0"] ? new Room(map["1,-1,0"].data) : null),"1,-1,0");
        containers["south-south"] = new Container("#south-south","{\"x\":0,\"y\":0,\"z\":12}",(map["0,-2,0"] ? new Room(map["0,-2,0"].data) : null),"0,-2,0");

        //bottom floor
        containers["bottom-north-north"] = new Container("#bottom-north-north","{\"x\":0,\"y\":-4,\"z\":-4}",(map["0,2,-1"] ? new Room(map["0,2,-1"].data) : null),"0,2,-1");
        containers["bottom-north-west"] = new Container("#bottom-north-west","{\"x\":-4,\"y\":-4,\"z\":0}",(map["-1,1,-1"] ? new Room(map["-1,1,-1"].data) : null), "-1,1,-1");
        containers["bottom-north"] = new Container("#bottom-north","{\"x\":0,\"y\":-4,\"z\":0}",(map["0,1,-1"] ? new Room(map["0,1,-1"].data) : null),"0,1,-1");
        containers["bottom-north-east"] = new Container("#bottom-north-east","{\"x\":4,\"y\":-4,\"z\":0}",(map["1,1,-1"] ? new Room(map["1,1,-1"].data) : null),"1,1,-1");
        containers["bottom-west-west"] = new Container("#bottom-west-west","{\"x\":-8,\"y\":-4,\"z\":4}",(map["-2,0,-1"] ? new Room(map["-2,0,-1"].data) : null),"-2,0,-1");
        containers["bottom-west"] = new Container("#bottom-west","{\"x\":-4,\"y\":-4,\"z\":4}",(map["-1,0,-1"] ? new Room(map["-1,0,-1"].data) : null),"-1,0,-1");
        containers["bottom-center"] = new Container("#bottom-center","{\"x\":0,\"y\":-4,\"z\":4}",(map["0,0,-1"] ? new Room(map["0,0,-1"].data) : null),"0,0,-1");
        containers["bottom-east"] = new Container("#bottom-east","{\"x\":4,\"y\":-4,\"z\":4}",(map["1,0,-1"] ? new Room(map["1,0,-1"].data) : null),"1,0,-1");
        containers["bottom-east-east"] = new Container("#bottom-east-east","{\"x\":8,\"y\":-4,\"z\":4}",(map["2,0,-1"] ? new Room(map["2,0,-1"].data) : null),"2,0,-1");
        containers["bottom-south-west"] = new Container("#bottom-south-west","{\"x\":-4,\"y\":-4,\"z\":8}",(map["-1,-1,-1"] ? new Room(map["-1,-1,-1"].data) : null),"-1,-1,-1");
        containers["bottom-south"] = new Container("#bottom-south","{\"x\":0,\"y\":-4,\"z\":8}",(map["0,-1,-1"] ? new Room(map["0,-1,-1"].data) : null),"0,-1,-1");
        containers["bottom-south-east"] = new Container("#bottom-south-east","{\"x\":4,\"y\":-4,\"z\":8}",(map["1,-1,-1"] ? new Room(map["1,-1,-1"].data) : null),"1,-1,-1");
        containers["bottom-south-south"] = new Container("#bottom-south-south","{\"x\":0,\"y\":-4,\"z\":12}",(map["0,-2,-1"] ? new Room(map["0,-2,-1"].data) : null),"0,-2,-1");

        //top floor
        containers["top-north-north"] = new Container("#top-north-north","{\"x\":0,\"y\":4,\"z\":-4}",(map["0,2,1"] ? new Room(map["0,2,1"].data) : null),"0,2,1");
        containers["top-north-west"] = new Container("#top-north-west","{\"x\":-4,\"y\":4,\"z\":0}",(map["-1,1,1"] ? new Room(map["-1,1,1"].data) : null), "-1,1,1");
        containers["top-north"] = new Container("#top-north","{\"x\":0,\"y\":4,\"z\":0}",(map["0,1,1"] ? new Room(map["0,1,1"].data) : null),"0,1,1");
        containers["top-north-east"] = new Container("#top-north-east","{\"x\":4,\"y\":4,\"z\":0}",(map["1,1,1"] ? new Room(map["1,1,1"].data) : null),"1,1,1");
        containers["top-west-west"] = new Container("#top-west-west","{\"x\":-8,\"y\":4,\"z\":4}",(map["-2,0,1"] ? new Room(map["-2,0,1"].data) : null),"-2,0,1");
        containers["top-west"] = new Container("#top-west","{\"x\":-4,\"y\":4,\"z\":4}",(map["-1,0,1"] ? new Room(map["-1,0,1"].data) : null),"-1,0,1");
        containers["top-center"] = new Container("#top-center","{\"x\":0,\"y\":4,\"z\":4}",(map["0,0,1"] ? new Room(map["0,0,1"].data) : null),"0,0,1");
        containers["top-east"] = new Container("#top-east","{\"x\":4,\"y\":4,\"z\":4}",(map["1,0,1"] ? new Room(map["1,0,1"].data) : null),"1,0,1");
        containers["top-east-east"] = new Container("#top-east-east","{\"x\":8,\"y\":4,\"z\":4}",(map["2,0,1"] ? new Room(map["2,0,1"].data) : null),"2,0,1");
        containers["top-south-west"] = new Container("#top-south-west","{\"x\":-4,\"y\":4,\"z\":8}",(map["-1,-1,1"] ? new Room(map["-1,-1,1"].data) : null),"-1,-1,1");
        containers["top-south"] = new Container("#top-south","{\"x\":0,\"y\":4,\"z\":8}",(map["0,-1,1"] ? new Room(map["0,-1,1"].data) : null),"0,-1,1");
        containers["top-south-east"] = new Container("#top-south-east","{\"x\":4,\"y\":4,\"z\":8}",(map["1,-1,1"] ? new Room(map["1,-1,1"].data) : null),"1,-1,1");
        containers["top-south-south"] = new Container("#top-south-south","{\"x\":0,\"y\":4,\"z\":12}",(map["0,-2,1"] ? new Room(map["0,-2,1"].data) : null),"0,-2,1");

        //render the room data for the containers
        for (var key in containers) {
            containers[key].render();
        }
    });
}