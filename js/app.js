var containers = {};
var map = null;
var inventory = null;

$(document).ready(function() {
    //load data from map
    loadMapData("map.json");

    inventory = new Inventory();

    //TEMP disable start area
    $("#player").attr("position","0 1.8 4");
    $("#inventory").attr("position","0 0.1 4");
    $("#tutorial").attr("visible","false");

    //map traversal
    $(".move").click(function() {
        move(this);
        return false;
    });

    //item pickups where preloaded in scene
    $(".pickup").click(function() {
        var item = $(this);
        inventory.addItem(item);
        item.remove();
        return false;
    });

    //enter the dungeon if the key is in the players hand
    $("#entrance-trigger").click(function() {
        if(inventory.itemOwnedAndInHand("key")) {
            $("#player").attr("position","0 1.8 4");
            $("#inventory").attr("position","0 0.1 4");
            $("#tutorial").attr("visible","false");
        }
        return false;
    });

    //open inventory/close inventory
    $("#compass").click(function() {
        if(inventory.active) {
            var inventory_slots = document.querySelectorAll('.inv-slot');
            for(var x=0; x<inventory_slots.length; x++) {
                inventory_slots[x].emit('animate-inventory-close');
            }
            inventory.active = false;
            setTimeout(renderInventory, 1500);
        }
        else if(!inventory.active) {
            var inventory_slots = document.querySelectorAll('.inv-slot');
            for(var x=0; x<inventory_slots.length; x++) {
                inventory_slots[x].emit('animate-inventory');
            }
            inventory.active = true;
            setTimeout(renderInventory, 1500);
        }
        return false;
    });
});

function renderInventory() {
    inventory.render();
}

//click events
function move(dom_element) {
    //fetch the current and target room ids
    var current_room_key_array = containers["center"].room_id.split(",");
    var container_key = $(dom_element).parent().attr("id");
    var target_room_key_array = containers[container_key].room_id.split(",")

    //console.log("current room id: " + current_room_key_array);
    //console.log("target room id: " + target_room_key_array);

    //calculate the offsets
    var offset_x = parseInt(target_room_key_array[0]) - parseInt(current_room_key_array[0]);
    var offset_y = parseInt(target_room_key_array[1]) - parseInt(current_room_key_array[1]);
    var offset_z = parseInt(target_room_key_array[2]) - parseInt(current_room_key_array[2]);

    //apply to each room
    //console.log("Each room will have these transforms applied:", offset_x, offset_y, offset_z);

    for (var key in containers) {
        var room_key_array = containers[key].room_id.split(",");
        room_key_array[0] = parseInt(room_key_array[0]) + offset_x;
        room_key_array[1] = parseInt(room_key_array[1]) + offset_y;
        room_key_array[2] = parseInt(room_key_array[2]) + offset_z;
        var new_room_key = room_key_array.join(",");

        //console.log(key + " => moving from " + containers[key].room_id + " to " + new_room_key);

        if(map[new_room_key])
        {
            containers[key].room = new Room(map[new_room_key].data);
            containers[key].room_id = new_room_key;
            //remove any existing item data
            containers[key].removeItems();
            //add item if it exists in the new room data
            if(map[new_room_key].item) {
                //console.log("Adding item for room key " + new_room_key + " in container " + key);
                containers[key].addItem(map[new_room_key].item);
            }
            containers[key].render();
        }
        else {
            containers[key].room = null;
            containers[key].room_id = new_room_key;
            //remove any existing item data
            containers[key].removeItems();
            containers[key].render();
        }
    }
}

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
    //set the visible component on the entities for this container
    if(this.room) {
        $(this.target).find(".top").attr("visible",(this.room.data.top ? this.room.data.top : "false"));
        $(this.target).find(".bottom").attr("visible",(this.room.data.bottom ? this.room.data.bottom : "false"));
        $(this.target).find(".left").attr("visible",(this.room.data.left ? this.room.data.left : "false"));
        $(this.target).find(".right").attr("visible",(this.room.data.right ? this.room.data.right : "false"));
        $(this.target).find(".back").attr("visible",(this.room.data.back ? this.room.data.back : "false"));
        $(this.target).find(".front").attr("visible",(this.room.data.front ? this.room.data.front : "false"));

        if(this.room.data.bottom == false) {
            $(this.target).find(".move").attr("visible","false");
        }
        else {
            $(this.target).find(".move").attr("visible","true");
        }
    }
    //if no room object exsists in the container, hide everything
    else {
        $(this.target).find(".top").attr("visible","false");
        $(this.target).find(".bottom").attr("visible","false");
        $(this.target).find(".left").attr("visible","false");
        $(this.target).find(".right").attr("visible","false");
        $(this.target).find(".back").attr("visible","false");
        $(this.target).find(".front").attr("visible","false");
        $(this.target).find(".move").attr("visible","false");
    }
}

Container.prototype.addItem = function(item) {
    var entity = document.createElement("a-entity");
    entity.setAttribute("id",item);
    entity.setAttribute("class","pickup");
    entity.setAttribute("position",this.position_multipliers.x + " " + this.position_multipliers.y + " " + (this.position_multipliers.z - 1));
    //assign the room id to the entity for easy removal later on
    entity.setAttribute("room-id",this.room_id);

    var model = document.createElement("a-model");
    model.setAttribute("src","models/" + item + ".dae");
    model.setAttribute("position","0 0 0");
    model.setAttribute("mixin",item + "-model");

    var trigger = document.createElement("a-entity");
    trigger.setAttribute("mixin",item + "-trigger");
    trigger.setAttribute("material","transparent: true; opacity: 0");

    entity.appendChild(model);
    entity.appendChild(trigger);

    $(this.target).append(entity);

    //add click even for item pickup
    $(entity).click(function() {
        var item = $(this);
        inventory.addItem(item);
        item.remove();
        //remove item from the json data
        map[item.attr("room-id")].item = null;
        return false;
    });
}

Container.prototype.removeItems = function() {
    //console.log("Removing " + this.item + " for room key " + this.room_id  + " in container " + this.target);
    $(this.target).find($(".pickup")).remove();
}

//Room Entity
function Room(data) {
    this.data = data;
}

//Inventory Entity
function Inventory() {
    this.items = {};
    this.slots = {1 : null, 2 : null, 3 : null, 4 : null};
    this.active = false;
}

Inventory.prototype.addItem = function(item) {
    this.items[item.attr("id")] = true;

    var slot_target = null;

    for(var key in this.slots) {
        if(this.slots[key] == null) {
            this.slots[key] = item.attr("id");
            slot_target = key;
            break;
        }
    }

    //create a clone of the item and inject it into the target slot
    var entity = item.clone();
    entity.attr("position","0 0 0");
    entity.attr("rotation","90 0 0");
    entity.attr("scale","0.5 0.5 0.5");
    if(this.active == false) {
        entity.attr("visible","false");
    }

    entity.attr("class","usable");
    $("#inv-slot-" + slot_target).append(entity);

    $(entity).click(function() {
        var player_item_id = ("#player-" + $(this).attr("id"));
        if($(player_item_id).attr("visible") == false) {
            $(player_item_id).attr("visible","true");
        }
        else {
            $(player_item_id).attr("visible","false");
        }
    });
}

Inventory.prototype.itemOwnedAndInHand = function(item_id) {
    var item = ("#player-" + item_id);
    if(this.items[item_id] && $(item).attr("visible") == true) {
        return true;
    }
    return false;
}

Inventory.prototype.render = function() {
    //set the attribute as visible for each slot
    for(var key in this.items) {
        if(this.active) {
            $('#' + key).attr("visible","true");
        }
        else {
            $('#' + key).attr("visible","false");
        }
    }
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
            //add items for visible rooms if they exist
            if(map[containers[key].room_id] && map[containers[key].room_id].item) {
                containers[key].addItem(map[containers[key].room_id].item);
            }
            containers[key].render();
        }
    });
}