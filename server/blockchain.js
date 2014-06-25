blockchain = {
  parseAddresses : function(content) {
    inputAddresses = this.getInputAddresses(content);
    return inputAddresses;
  	addresses = [];
  	content = EJSON.parse(content);
        for(var i=0;i<content.txs.length;i++){
          var outs = content.txs[i].out;
          for(var i=0;i<outs.length;i++){
             var addr = outs[i].addr;
             console.log("processing " + addr);
             if (! this.contains(inputAddresses, addr)) {
             	     console.log("found: " + addr);
             	 addresses.push(addr);
             }
          }
        }
     
     return addresses;
  },
  
  getInputAddresses : function(content) {
  	addresses = [];
  	content = EJSON.parse(content);
        for(var i=0;i<content.txs.length;i++){
          var inputs = content.txs[i].inputs;
          for(var i=0;i<inputs.length;i++){
             var addr = inputs[i].prev_out.addr;
              addresses.push(addr);
          }
        }
        return addresses;
  },
  
  contains : function (array, obj) {
    var i = array.length;
    while (i--) {
       if (array[i] === obj) {
           return true;
       }
    }
    return false;
  }
}
