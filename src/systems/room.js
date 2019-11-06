see https://aframe.io/docs/0.9.0/core/systems.html

the room system can let the room components register with it

the room system can also handle parsing of the level data to set the initial state of the rooms? We'll only ever render a set number of room components as they are effectively a lense through which to view the room data

the data, whether procedural or file based, will be the same. Could write a short procedural function that virtually creates a 100x100 room space and then mines it. Essentially everything starts off as 0 and then a mined space becomes a 1 (meaning a room is present). 1's would then need connecting based on what is arround them. For example A 1 with a 1 to the north, 1 to the south, 1 to the west, and 1 to the east has no walls.
