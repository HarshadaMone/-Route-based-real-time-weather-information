var geoJSON = {
	type: "FeatureCollection",
	features: []
};
var map;
var drawIcons = function (weather) {
  map.data.addGeoJson(geoJSON);
};
function jsonToGeoJson(weatherItem, latitude, longitude) {
		console.log(latitude + " , " + longitude);
	var feature = {
	    type: "Feature",
	    properties: {
			lat: latitude,
			lon: longitude,
			sunrise : weatherItem.sys.sunrise,
			sunset : weatherItem.sys.sunset,
			main : weatherItem.weather[0].main, //array
			main_description : weatherItem.weather[0].description, //array
			main_icon : weatherItem.weather[0].icon, //array
			base : weatherItem.base,
			temp : (weatherItem.main.temp - 273.15),
			humidity : weatherItem.main.humidity,
			pressure : weatherItem.main.pressure,
			temp_min : (weatherItem.main.temp_min- 273.15),
			temp_max : (weatherItem.main.temp_max- 273.15),
			wind_speed : weatherItem.wind.speed,
			wind_deg : weatherItem.wind.deg,
			clouds : weatherItem.clouds.all,
			dt : weatherItem.dt,
			id : weatherItem.id,
			name : weatherItem.name,	
			cod: weatherItem.cod,
			day : weatherItem.day,
			timeOfDay : weatherItem.timeOfDay,
			zipcode : weatherItem.zipcode,
			icon: "http://openweathermap.org/img/w/"
				+ weatherItem.weather[0].icon  + ".png"
	    },
	    geometry: {
			type: "Point",
			coordinates: [longitude, latitude]
	    }
	};
	// Set the custom marker icon
    map.data.setStyle(function(feature) {
      return {
        icon: {
          url: feature.getProperty('icon'),
          anchor: new google.maps.Point(25, 25)
        }
      };
    });
    // returns object
    return feature;
};

function initMap() {
	var origin_place_id = null;
	var destination_place_id = null;
			
			
			
			
	var travel_mode = google.maps.TravelMode.WALKING;
	map = new google.maps.Map(document.getElementById('map'), {
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
	var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
	destination_autocomplete.bindTo('bounds', map);
	//map.data.loadGeoJson('https://storage.googleapis.com/maps-devrel/google.json');
	

//	
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
	  route(origin_place_id, destination_place_id, travel_mode,directionsService, directionsDisplay);
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

  function route(origin_place_id, destination_place_id, travel_mode,directionsService, directionsDisplay) {
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
	  	//	}	
	  	});
  	}
}
	  	function showWeatherInfoOnMap(response) {
	  		//window.alert('starting : ' + JSON.stringify(response));
	  		var zipCount = 0;
	  		var zipCode = [];
			var lat = [];
			var lng = [];
			var flag = 0;
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
	  						var flag = 0;
							for (var p = 0; p < length.zipCode;p++ ){
								if(zip == zipcode[p]){
										flag = 1 ;
								}
							}	
							if(flag ==0){
								zipCode[zipCount] = zip;
								lat[zipCount] = path.lat();
								lng[zipCount++] = path.lng();
								console.log(" zip:"+zip + " lng:"+path.lng()+ " lat:"+path.lat());
							}
												
					}
	  			}
	  		}
			console.log(lat);
			console.log(lng);
	  		//zipCode = eliminateRedundancy(zipCode, lat, lng);
	  		getWeatherFromServer(zipCode, lat, lng);
	  		showOnMap();
	  	}	
  
	  	 function getWeatherFromServer(zipCode, lat, lng) {
	  		var weathers = [];
	  		for(var i=0; i<zipCode.length; i++){
	  			var requestString = "http://localhost:8080/FinalProject281Server/weather/map/"+zipCode[i];
	  			request = new XMLHttpRequest();
	  			request.open("get", requestString, false);
	  			request.setRequestHeader("Access-Control-Allow-Origin","*");
	  			request.withCredentials = "true";
	  			request.send();
	  			if (request.status === 200) {
	  				//console.log(request.responseText);
	  				var results = JSON.parse(request.responseText);
	  				//console.log("Check response"+JSON.stringify(results));
					//alert(JSON.stringify(jsonToGeoJson(results)));
					console.log(lat[i] +"   " + lng[i]);
					var feature = jsonToGeoJson(results, lat[i], lng[i]);
					geoJSON.features.push(feature);
	  			}
	  		}
			console.log("Now draw Icons");
			drawIcons(geoJSON);
	  	} 

	  	/* function eliminateRedundancy(zipCode, lat, lng){
	  		console.log(zipCode);
	  		var end = zipCode.length;
	  		for (var i = 0; i < end; i++) {
	  			for (var j = i + 1; j < end; j++) {
	  				if(zipCode[i]==zipCode[j]){
	  					var leftShift = j;
	  					for(var k = j+1; k < end; k++, leftShift++){
	  						zipCode[leftShift] = zipCode[k];
							lat[leftShift] = lat[k];
							lng[leftShift] = lng[k];
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
			console.log(lat);
			console.log(lng);
	  		return zipCodeNew;
	  	} */
  
	  	function getZipCodeFromCoordinates(lat, lng) {
	  		//gettingData = true;
	  		var requestString = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=false";
	  		request = new XMLHttpRequest();
	  		request.open("get", requestString, false);
	  		request.send();
	  		if (request.status === 200) {
	  			//console.log(request.responseText);
	  			return getZipCode(JSON.parse(request.responseText));
	  		}
	  	}

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
	  	}

function showOnMap(){
	var infowindow = new google.maps.InfoWindow();
	
	 map.data.addListener('click', function(event) {
		infowindow.setContent( 
		'<div style="background-color:seashell;">'
	   +"<img src=" + event.feature.getProperty("icon") + ">"
	   + "<h2><br />"+ event.feature.getProperty("name")+"</h2>"
	    + "<b><br/>" + event.feature.getProperty("day")+
	   + "<br />Sunrise Time: " + event.feature.getProperty("surise") 
	   + "<br />Sunset Time" + event.feature.getProperty("sunset")
	   + "<br />Main: " + event.feature.getProperty("main")
	   + "<br />Description: " + event.feature.getProperty("main_description")
	   + "<br />Base: " + event.feature.getProperty("base")
	   + "<br />Temp: " + event.feature.getProperty("temp")+" °C"
	   + "<br />Humidity: " + event.feature.getProperty("humidity")+"%"
	   + "<br />Pressure: " + event.feature.getProperty("pressure")+" hPa"
	   + "<br />Min Temp: " + event.feature.getProperty("temp_min")+" °C"
	   + "<br />Max Temp: " + event.feature.getProperty("temp_max")+" °C"
	   + "<br />Wind Speed: " + event.feature.getProperty("wind_speed")+"meter/sec"
	   + "<br />Wind Deg: " + event.feature.getProperty("wind_deg")+" °"
	   + "<br />Cloudiness: " + event.feature.getProperty("clouds")+"%"
	   + "<br />Date: " + event.feature.getProperty("dt")
	   + "<br />Id: " + event.feature.getProperty("id")
	   
	  // + "<br />Cod: " + event.feature.getProperty("cod")
	  
	   //+ "<br />Time: " + event.feature.getProperty("timeOfDay")
	   + "<br />Zipcode: " + event.feature.getProperty("zipcode")+"</b>"
	   +"</div>"
		);
		infowindow.setOptions({
		  position:{
			lat: event.feature.getProperty("lat"),
			lng: event.feature.getProperty("lon")
		  },
		  pixelOffset: {
			width: 0,
			height: -15
		  }
		});
	 });
		infowindow.open(map);	
}