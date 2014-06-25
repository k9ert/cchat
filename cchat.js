ChatLines = new Meteor.Collection("ChatLines");
Rooms = new Meteor.Collection("Rooms");

if (Meteor.isServer) {

  Meteor.startup(function () {


    var publicAddresses = ["1Q1hdPi1acBcsfq2BYjcat8h9J2hUoT1te","1PDpacPooxbQNmK2RWx6EKxUJuaY9Jt5q7", "1H8DxdnBpnTn4PcCYUV1sK5kqi6N6SH8pK","13LYNodVxnKHMPp1LucWXccudc6jndtBBT","1PjjiQ4Tdqg8btq9s64TdTMVMMFKhkq4qs"];
		
    if (Rooms.find().count() === 0) {
      console.log("filling up Rooms");
      var timestamp = (new Date()).getTime();
      for (var i = 0; i < publicAddresses.length; i++) {
      	  console.log("importing " + publicAddresses[i]);
          Rooms.insert({address: publicAddresses[i],
                      timestamp: timestamp,
                      owner: null});
          timestamp += 1; // ensure unique timestamp.
       }
 
     }
  });

  Meteor.publish("chatlines", function () {
        return ChatLines.find();
    });
    ChatLines.allow({
        insert: function(userId,doc){
            return true;
        }
    })
    
  Meteor.publish("rooms", function (owner) {
  		  return Rooms.find({"$or" : [{owner : owner},{owner : null}]});
  });
  
  Meteor.methods({
    updateAddress: function (address) {
      check(address, String);
      // .. do stuff ..
      console.log("oh, look, updating address:")
      console.log(address);
      try {
        var result = HTTP.call("GET", "https://blockchain.info/address/"+address+"?format=json");
        addresses = blockchain.parseAddresses(result.content);
        console.log("found these: " + addresses);
        Rooms.update({address : address}, {$addToSet: {payerAddresses : addresses}});
        return true;
      } catch (e) {
      	      console.log("ups, error: " + e);
        return false;
      }
     },
  });

}
 
if (Meteor.isClient) {
	

    Session.set('userPrivateKey', "5JsgiQHL1sxFK38KP29u26Gca5Vgq2yMKrHgGAECBhbQazJ3dfR");
    Session.set('userPublicAddress',null);
    Session.set('userPublicAddressAbbrev',null);
    Session.set('currentRoom',null);
//    Session.set('userPublicAddress', null);

    Meteor.subscribe('chatlines');
    Template.chat.lines = function () {
    	    return ChatLines.find({currentRoom : Session.get('currentRoom')},{sort:{created_at:-1},limit:50});
    };
    
    Template.chat.isValid = function (line) {
      signedAddress = verify_message(this.signature,this.text);
      return signedAddress == this.userPublicAddress;
    };
    
    Template.chat.chatlineDate = function(timestamp){
        var date = new Date();
        date.setTime(timestamp);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        return hours + ':' + minutes + ':' + seconds;
    };
    Template.chat.events({
        'click #postChat' : function (event,template) {
            if (! Session.get('currentRoom')) {
              return
            }
            userPrivateKey = template.find('#userPrivateKey').value
            userPublicAddressAbbrev = new Bitcoin.ECKey(Session.get("userPrivateKey")).getBitcoinAddress().toString().substring(0,6);
            msgSig = sign_message(new Bitcoin.ECKey(userPrivateKey),template.find('#chatText').value)
            userPublicAddressAbbrev = 
            ChatLines.insert({
                created_at:          new Date().getTime(),
                text:                template.find('#chatText').value,
                signature:           msgSig,
                userPublicAddress:   template.find('#userPublicAddress').value,
                userPublicAddressAbbrev: userPublicAddressAbbrev,
                userpublicKey:	     template.find('#userPublicKey').value,
                currentRoom:	     Session.get('currentRoom')
            });
        }
    });
    
    Template.userId.events = {
    	    'input input#userPrivateKey': function (ev) {
    	    	    console.log("input userPrivateKey triggered");
               Session.set('userPrivateKey', ev.srcElement.value);
    	    }
    }
    Template.userId.userPrivateKey = function() {
    	return Session.get("userPrivateKey") ? Session.get("userPrivateKey") : "" ;
    }
    Template.userId.userPublicKey = function() {
    	return  new Bitcoin.ECKey(Session.get("userPrivateKey"));
    }
    Template.userId.userPublicAddress = function() {
    	userPublicAddress =   new Bitcoin.ECKey(Session.get("userPrivateKey")).getBitcoinAddress().toString();
    	userPublicAddressAbbrev = userPublicAddress.substring(0,6);
    	Session.set('userPublicAddress',userPublicAddress);
    	Session.set('userPublicAddressAbbrev',userPublicAddressAbbrev);
    	return  userPublicAddress;
    	
    }
}

