Meteor.subscribe('rooms', Session.get("userPublicAddress"));

Template.rooms.rendered = function () {
  $('#create-room-button').click(function() {
    console.log("create-room-button clicked");
    freeRoom = Rooms.findOne({userPublicAddress: { "$not" : { userPublicAddress : this.userPublicAddress}}});
    console.log("userPublicAddress is: ");
    console.log(Session.get("userPublicAddress"));
    console.log("freeRoom is: " + freeRoom.toString());
    Rooms.update({_id : freeRoom._id}, {$addToSet: {owner : Session.get("userPublicAddress").toString(), address : freeRoom.address }} );
    console.log( freeRoom);
    Session.set("currentRoom", freeRoom.address);
  }); 
  $('.roomSwitch').click(function(roomElement) {
    console.log("switching room ..." );
    console.log(roomElement.target.outerText);
    Session.set("currentRoom", roomElement.target.outerText);
  });
  $('.refresh-room-button').click(function(roomRefreshButton) {
    console.log("refreshing room ..." );
    console.log(roomRefreshButton.target.id);
    Meteor.call("updateAddress",roomRefreshButton.target.id);
    rooms = Rooms.findOne({});
    console.log("Now free Room: " + room)
  });
  $('.enable-user-button').click(function(enableUserButton) {
    room = Rooms.findOne({address : Session.get("currentRoom")});
    console.log("executing enableUser");
  Rooms.update({address : room.address}, {$addToSet: {enabledUsers : enableUserButton.target.id}});
  });
}

Template.rooms.userRooms = function() {
	rooms = Rooms.find({owner : Session.get("userPublicAddress")},{fields : {address : 1 , owner : 1}},{limit:50});
	console.log(rooms.toString())
	return rooms;
}

Template.usersInRoom.usersInRoom = function() {
	room = Rooms.findOne({address : Session.get("currentRoom")});
	
	console.log("executing Template.usersInRoom.usersInRoom");
	console.log(room);
	return room == null ? null : room.payerAddresses ;
}
	

Template.rooms.userPublicAddress = function() {
	console.log("roo.userPublicAddress called");
	console.log(Session.get("userPublicAddress") );
  return Session.get("userPublicAddress") ? Session.get("userPublicAddress") : "" ;
}
