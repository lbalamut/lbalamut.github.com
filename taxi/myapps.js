
/**
 * A little app to help get you home when you are drunk at night
 * Simply open the link (bookmark it to your homescreen and it looks like an app!)
 * wait a couple of seconds and you will be shown the closest taxi cab
 * to you.
 * If we can find a phone number, tap the name to dial
 * otherwise, open the location on nokia maps and stagger there yourself
 * made in around two hours, lubricated by Berliner Pilsner by @VeganBen
 * and using the Nokia RESTful Places API
 * http://api.maps.nokia.com/en/restplaces/overview.html
 **/
var myapp = {
  placesServer: "http://demo.places.nlp.nokia.com/places/",
  appid:"demo_qCG24t50dHOwrLQ",
  appcode: "NYKC67ShPhQwqaydGIW4yg",

  findTaxi: function(position){
  }
}

$(document).ready(function(){
  $("#taxi").click(function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(myapp.findTaxi);
    }
  })
});
