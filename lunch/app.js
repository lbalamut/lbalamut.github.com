var lunch = {
    placesBaseUrl: "http://demo.places.nlp.nokia.com/places/v1",
    appId:"demo_qCG24t50dHOwrLQ",
    appCode: "NYKC67ShPhQwqaydGIW4yg",
    lat: 0,
    lon: 0,
    geocoder: null,

    gotLocationFromBrowser: function(position){
       lunch.updateLocation(position.coords.latitude, position.coords.longitude);
       lunch.search();
    },



    updateLocation: function(lat, lon, addr){
       lunch.lat = lat;
       lunch.lon = lon;
       $('#location').empty();
       $('#locationTemplate').tmpl({lat: lat, lon: lon, addr: addr}).appendTo("#location");
    },

    renderSearchResults: function (searchResponse){
       $('#results').empty();
       $('#resultsTemplate').tmpl({items: lunch.processItems(searchResponse.results.items) }).appendTo("#results");

        jQuery( 'tr td a' ).click(function() {
            try {
                lunch.showPlaceForUrl( this.href );
                return false;
            } catch ( err ) {
                console.log(err);
                return false;
            }
        });
    },

    processItems: function( searchResults) {
        var filteredResults = lunch.filter( searchResults);
        filteredResults.sort( lunch.comparator);

        return filteredResults;
    },

    comparator: function( a, b) {
        var diff = parseInt(a.distance) - parseInt(b.distance);
        if( diff>0) {
            return 1;
        } else if( diff==0) {
            return 0;
        } else {
            return -1;
        }
    },

    filter: function( searchResults) {
        var filteredResults = [];

        for ( var result in searchResults) {
            if(searchResults[result].type == "urn:nlp-types:place") {
                filteredResults.push( searchResults[result]);
            }
        }
        return filteredResults;
    },

    showPlaceForUrl: function( placeUrl){
        $.ajax({
            url: placeUrl+"&tf=html",
            dataType: 'json',
            success: lunch.showPlaceInfo,
            error: function(jqXHR, textStatus, errorThrown){
                console.log(textStatus);
            }
        });
    },

    showPlaceInfo: function (placeJson){
        $("#placedetails").empty();
        $("#placedetails").append( lunch.placeJsonToPlaceHtml(placeJson));
    },

    placeJsonToPlaceHtml: function( placeJson){
        var html = "<h1 class=\"placename\">"+placeJson.name+"</h1>";

        html += "<p>" +placeJson.location.address.text + "</p>";

        var contacts = placeJson.contacts;
        for( var contactId in contacts) {
            var contact = contacts[contactId];
            for( var contactDataId in contact) {
                var contactData = contact[contactDataId];
                html += "<p class=\"contact\">" + contactData.label + " : " + contactData.value + "</p>";
            }
        }

        html += "<p>";
        var images = placeJson.media.images.items;
        for( var image in images) {
            html += "<div class=\"picture top\">";
            html +=   "<img src=\"" +images[image].src+ "\" height=\"200\"/> ";
            if( images[image].attribution != null){
                html += "<p class=\"attribution\">"+images[image].attribution+"<p>";
            }
            html += "</div>";
        }
        html += "</p>";

        var reviews = placeJson.media.reviews.items;
        if( reviews.length>0) {
            html += "<p class=\"review-section-heading\">Reviews</p>";
        }
        for( var reviewId in reviews) {
            var review = reviews[reviewId];
            if( review.title != null){
                html+="<p class=\"review-title\">"+review.title+"</p>";
            }
            html += "<p class=\"review-text\">"+review.description+"</p><p class=\"attribution\">"+review.attribution+"</p>";
        }


        if( placeJson.attribution != null) {
            html += "<p class=\"attribution\">"+placeJson.attribution+"</p>";
        }

        return html;
    },

    search: function(){
        $.ajax({
          url: lunch.placesBaseUrl + "/discover/explore?cat=restaurant"
            + "&at=" + lunch.lat + "," + lunch.lon
            + "&app_id=" + lunch.appId+"&app_code=" + lunch.appCode,
          dataType: 'json',
          success: lunch.renderSearchResults,
          error: function(jqXHR, textStatus, errorThrown){
            alert(textStatus);
          }
        });
    },

    setupGeocoder: function(){
        lunch.geocoder = new nokia.maps.search.Manager();
        lunch.geocoder.addObserver("state", function(observedManager, key, value) {
            if(value == "finished") {
                console.log("geocoding finished");
                if (observedManager.locations.length > 0) {
                    console.log("got some locations");
                    var loc = observedManager.locations[0];
                    var pos = loc.displayPosition;
                    if (pos){
                        lunch.updateLocation(pos.latitude, pos.longitude, loc.label);
                    }
                    lunch.search();
                }
            } else if(value == "failed") {
                alert("SEARCH FAILED.");
            }
        });
    },

    geocode: function(){
        var address = $("#address").val();
        lunch.geocoder.geocode(address);
    },


};