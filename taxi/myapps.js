
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

  findTaxi: function(position) {
    $("#taxi").text("Hold on..")
    $.getJSON(myapp.search(position, "taxi service"), myapp.getTaxiInfo)
  }, 

  search: function(position, query) {
    var lat = position.coords.latitude,
        lon = position.coords.longitude;
    return (this.placesServer + 
            "v1/discover/search?"+ ["app_id="  + this.appid, "app_code=" + this.appcode,
            "geolocation=geo:" + lat + "," + lon,
            "q=" + query,
            "size=25"].join("&"));
  },

  getTaxiInfo: function(searchResult) {
    if(searchResult.results.items.length){
      $.getJSON(searchResult.results.items[0].href, myapp.getPhoneAndName)
    }
  },

  getPhoneAndName: function(place) {
    var title = place.name,
        phoneLink;

    $("#taxi").text("Taxi!");
    $("#taxiname").html("")
                  .append("<span>" + title + "<span>")
                  .css("background-image","url(" + place.icon + ")");

    if(place.contacts && place.contacts.phone && place.contacts.phone.length){
      phoneLink = "tel:" +place.contacts.phone[0].value;

      $("#taxiname").attr("href", phoneLink)
                    .append("<span>" + phoneLink + "<span>");

      window.location.href = phoneLink;
    }
  }

}

$(document).ready(function(){
  $("#taxi").click(function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(myapp.findTaxi);
    }
  })
});
