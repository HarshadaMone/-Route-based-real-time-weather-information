function initMap() {
  var origin_place_id = null;
  var destination_place_id = null;
  var travel_mode = google.maps.TravelMode.WALKING;
  var map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    center: {lat: 37.37, lng: -121.92},
    zoom: 13
  });
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);

  var origin_input = document.getElementById('origin-input');
  var destination_input = document.getElementById('destination-input');
  var modes = document.getElementById('mode-selector');

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

  var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  origin_autocomplete.bindTo('bounds', map);
  var destination_autocomplete =
      new google.maps.places.Autocomplete(destination_input);
  destination_autocomplete.bindTo('bounds', map);

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, mode) {
    var radioButton = document.getElementById(id);
    radioButton.addEventListener('click', function() {
      travel_mode = mode;
    });
  }
  setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
  setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
  setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

  function expandViewportToFitPlace(map, place) {
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  }

  origin_autocomplete.addListener('place_changed', function() {
    var place = origin_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    expandViewportToFitPlace(map, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    origin_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
          directionsService, directionsDisplay);
  });

  destination_autocomplete.addListener('place_changed', function() {
    var place = destination_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    expandViewportToFitPlace(map, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    destination_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
          directionsService, directionsDisplay);
  });

  function route(origin_place_id, destination_place_id, travel_mode,
                 directionsService, directionsDisplay) {
    if (!origin_place_id || !destination_place_id) {
      return;
    }
    directionsService.route({
      origin: {'placeId': origin_place_id},
      destination: {'placeId': destination_place_id},
      travelMode: travel_mode
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        // Show weather data on map
        showWeatherInfoOnMap(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  function showWeatherInfoOnMap(response) {
    window.alert('starting : ' + JSON.stringify(response));
    var zipCount = 0;
    var zipCode = [];
    for (var numRoute = 0; numRoute < response.routes.length; numRoute++) {
      var route = response.routes[numRoute];
      for (var numLeg = 0; numLeg < route.legs.length; numLeg++) {
        var leg = route.legs[numLeg];
        for (var numStep = 0; numStep < leg.steps.length; numStep++) {
          var step = leg.steps[numStep];
          //for (var numpath = 0; numpath < step.path.length; numpath+=10) {
            var numpath = 0;
            var path = step.path[numpath];

            var zip = getZipCodeFromCoordinates(path.lat(), path.lng());
           	zipCode[zipCount++] = zip;
        }
      }
    }
    zipCode = eliminateRedundancy(zipCode);
    getWeatherFromServer(zipCode);
  };
  
  function getWeatherFromServer(zipCode) {
	  var weathers = [];
	  for(var i=0; i<zipCode.length; i++) {
	  	var requestString = "http://localhost:8080/FinalProject281Server/weather/map/"+zipCode[i];
	    request = new XMLHttpRequest();
	    request.open("get", requestString, false);
	    request.setRequestHeader("Access-Control-Allow-Origin","*");
	    request.withCredentials = "true";
	    request.send();
	    if (request.status === 200) {
	  		console.log(request.responseText);
	  		var results = JSON.parse(request.responseText);
	        window.alert("Check response"+JSON.stringify(results));
			//return getZipCode(JSON.parse(request.responseText));
		}
	  }
  };

  function eliminateRedundancy(zipCode){
	  console.log(zipCode);
	  var end = zipCode.length;
	  for (var i = 0; i < end; i++) {
		  for (var j = i + 1; j < end; j++) {
			 if(zipCode[i]==zipCode[j]){
				 var leftShift = j;
				 for(var k = j+1; k < end; k++, leftShift++){
					 zipCode[leftShift] = zipCode[k];
				 }
				 end--;
				 j--;
			 } 
		  }	  
	  }
	  var zipCodeNew = [];
	  for (i = 0; i< end;i++){
		  zipCodeNew[i] = zipCode[i];
	  }
	  console.log(zipCodeNew);
	  return zipCodeNew;
  };
  
  function getZipCodeFromCoordinates(lat, lng) {
    //gettingData = true;
    var requestString = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=false";
    request = new XMLHttpRequest();
    request.open("get", requestString, false);
    request.send();
    if (request.status === 200) {
  		console.log(request.responseText);
		return getZipCode(JSON.parse(request.responseText));
	}
  };

  // Take the JSON results and proccess them
  function getZipCode(results) {
	window.alert(results);
    if (results.results.length > 0) {
        for (var i = 0; i < results.results.length; i++) {
          var result = results.results[i];
          for(var numAddress = 0; numAddress < result.address_components.length; numAddress++) {
            var address_comp = result.address_components[numAddress];
            if(address_comp.types[0] == 'postal_code'){
              var zipCode = address_comp.long_name;
              return zipCode;
            }
          }
        }
    }
  };
}