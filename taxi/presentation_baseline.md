# html
## mostly css
## we have 2 elements..
# Start with a template
{{{

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
    findTaxi: function() {}

}

$(document).ready(function(){
  $("#taxi").click(function(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(myapp.findTaxi);
    }
  })
});

}}}

# We start with this code
## We use jquery, the geolocation is taken there
## and we are calling the callback on myapp

# you can go to the playground using bit.ly/placesapi
## you can register and start
## playground entry points on the left
## we need to find a taxi
## We can search for taxi service
## And this is how the url looks like

# Let's implement it 

{{{

    search: function(position, query){
      var lat = position.coords.latitude,
          lon = position.coords.longitude;
      return (this.placesServer + 
              "v1/discover/search?"+ ["app_id="  + this.appid, "app_code=" + this.appcode,
              "geolocation=geo:" + lat + "," + lon,
              "q=" + query,
              "size=25"].join("&"));
    },
    findTaxi: function(position){
      $("#taxi").text("Hold on..")
      $.getJSON(myapp.search(position, "taxi service"), myapp.getTaxiInfo)
    }
}}}
## assume we pass the position as parameter
## geolocation is actually a header
## The search query is also passed in
## and from find taxi we can also implement it as a callback we put get taxi info temporarly

# Playground, the search response, 
## we get the first item and to get more information 
## we just follow the href
### places details
### name
### icon
### phone number
### localisation (label)

# code
{{{
    getTaxiInfo: function(data) {
      if(data.results.items.length){
        $.getJSON(data.results.items[0].href, myapp.getPhoneAndName)
      }
    },
}}}

# let's also grab the phone and the name
{{{
    getPhoneAndName: function(place) {
      var title = place.name,
          phoneLink;

      $("#taxi").text("Taxi!");
      $("#taxiname").html("")
                    .append("<span>" + title + "<span>")
                    .css("background-image","url(" + place.icon + ")");

      if(place.contacts && place.contacts.phone[0]){
        phoneLink = "tel:" +place.contacts.phone[0].value;
        window.location.href = phoneLink;
        $("#taxiname").attr("href", phoneLink)
                      .append("<span>" + phoneLink + "<span>");
      }
    }
}}}
# We add the title, we render the icon as background
## we then add teh phone number
## if everything is correct let's have a look to how it looks like

# Additional info for places
## L'ambassade d'avergne
## reviews
## images


