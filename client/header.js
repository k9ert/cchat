Template.header.userPublicAddressAbbrev = function() {
  return Session.get("userPublicAddressAbbrev") ? Session.get("userPublicAddressAbbrev") : "" ;	
}

Template.header.rendered = function () {
  $('#about').hide();
  $('#chat_link').click(function() {
    $('#about').hide();
    $('#chat').show();
    $(".active").removeClass("active");
    $(this).addClass("active");
  }); 
  $('#about_link').on( "click", function( event ) {
    console.log("info_link clicked");
    $('#chat').hide();
    $('#about').show();
    $(".active").removeClass("active");
    $(this).addClass("active");
  });
    $('#rooms_link').on( "click", function( event ) {
    console.log("rooms_link clicked");
    $('#chat').hide();
    $('#about').hide();
    $('#rooms').show();
    $(".active").removeClass("active");
    $(this).addClass("active");
  });

}
