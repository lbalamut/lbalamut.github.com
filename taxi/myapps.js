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
var $ = function(el) {
    var ret;
	if(document.getElementById(el)){
		ret = document.getElementById(el);
	} else {
		ret = document.querySelectorAll(el)
	}
	if (ret.length == 0){
		return false
	}
	return ret;
};

var myApp = {

    placesServer: "http://demo.places.nlp.nokia.com/places/v1/discover/explore?",
    appid:"demo_qCG24t50dHOwrLQ",
    appcode: "NYKC67ShPhQwqaydGIW4yg",
    lat: 51.2,
    lon: 13.5,

    getUrl: function(q,c){
        return (this.placesServer + ["app_id="  + this.appid,
        "app_code=" + this.appcode,
        "tf=plain",
        "at=" + this.lat + "," + this.lon,
        "cat=" + q,
        "size=25",
        "callback=" + c].join("&"));
    },

    positionGot: function(position){
        myApp.lat = position.coords.latitude;
        myApp.lon = position.coords.longitude;
        myApp.jsonp(myApp.getUrl("taxi-stand", "myApp.loadData"));
    },

    jsonp: function(url){
        var script = document.createElement("SCRIPT");
        script.setAttribute("src", url);
        script.setAttribute("type","text/javascript");
        document.getElementsByTagName("HEAD")[0].appendChild(script);
    },

    getDetails: function(data){
        console.log(data);
    	var phoneNr = data.contacts.phone && data.contacts.phone[0].value,
    		placeHref = data.view,
    	    placeLink = document.createElement("A");

    	placeLink.href = data.view;
    	placeLink.className = 'viewlink';
        $("taxiname").href = "tel://" +  phoneNr;
    	placeLink.appendChild(document.createTextNode("view on a map"));

        //removeme
        var content = document.createElement("SPAN");
        content.innerHTML = "tel://" +  phoneNr;
        $("taxiname").appendChild(content);

    	document.body.appendChild(placeLink);

    },

    loadData: function(data){
        if(data.results.items.length){
            var items = data.results.items,
                taxiItems = items.filter(function(el){
                    return (el.category && el.category.title && el.category.title.indexOf("Taxi") != -1);
                }),
                item;
            taxiItems.sort(function(a,b){
                return a.distance - b.distance;
            })
            if(taxiItems.length){
                item = taxiItems[0];
                var content = document.createElement("SPAN");
                content.innerHTML = item.title;
                /*
                content.setAttribute("id", "companyname");
                content.addEventListener("click", function(){
                    return (function(h){
                        myApp.getDetails(h);
                    })(item.href);
                }, false);
                */
                $("taxiname").innerHTML = "";
                $("taxiname").appendChild(content);
                $("taxiname").style.backgroundImage = "url(" + item.icon + ")";
                myApp.jsonp(item.href + "&callback=myApp.getDetails");
            } else {
                $("taxiname").innerHTML = "sorry.. can't find a taxi";
            }
        }
    }
};


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(myApp.positionGot);
}

if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", myApp.addEvents, false);
} else {
	document.body.onload = myApp.addEvents;
}
