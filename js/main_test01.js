        function initMap() {
        var origin_place_id = null;
        var destination1_place_id = null;
        var destination2_place_id = null;
        var destination3_place_id = null;
        var destination4_place_id = null;
        var travel_mode = 'DRIVING';
        var map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {lat: 22.5726, lng: 88.3639},
          zoom: 13
        });
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer({
          draggable: true,
          map: map,
          panel: document.getElementById('right-panel')
        });
        directionsDisplay.setMap(map);

        var origin_input = document.getElementById('origin-input');
        var destination1_input = document.getElementById('destination1-input');
        var destination2_input = document.getElementById('destination2-input');
        var destination3_input = document.getElementById('destination3-input');
        var destination4_input = document.getElementById('destination4-input');
        var modes = document.getElementById('mode-selector');

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination1_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination2_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination3_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination4_input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

        var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
        origin_autocomplete.bindTo('bounds', map);
        var destination1_autocomplete =
            new google.maps.places.Autocomplete(destination1_input);
        destination1_autocomplete.bindTo('bounds', map);
        var destination2_autocomplete =
            new google.maps.places.Autocomplete(destination2_input);
        destination2_autocomplete.bindTo('bounds', map);
        var destination3_autocomplete =
            new google.maps.places.Autocomplete(destination3_input);
        destination3_autocomplete.bindTo('bounds', map);
        var destination4_autocomplete =
            new google.maps.places.Autocomplete(destination4_input);
        destination3_autocomplete.bindTo('bounds', map);

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, mode) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function() {
            travel_mode = mode;
          });
        }
        setupClickListener('changemode-walking', 'WALKING');
        setupClickListener('changemode-driving', 'DRIVING');

        directionsDisplay.addListener('directions_changed', function() {
          computeTotalDistance(directionsDisplay.getDirections());
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });

        function expandViewportToFitPlace(map, place) {
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(13);
          }
        }

        origin_autocomplete.addListener('place_changed', function() {
          var place = origin_autocomplete.getPlace();
          //alert("Hii" + place);
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          expandViewportToFitPlace(map, place);

          // If the place has a geometry, store its place ID and route if we have
          // the other place ID
          origin_place_id = place.place_id;
          route(origin_place_id, destination1_place_id, travel_mode,
                directionsService, directionsDisplay);
        });

          destination1_autocomplete.addListener('place_changed', function() {
          var place = destination1_autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          expandViewportToFitPlace(map, place);

          // If the place has a geometry, store its place ID and route if we have
          // the other place ID
          destination1_place_id = place.place_id;
          /*route(origin_place_id, destination1_place_id, travel_mode,
                directionsService, directionsDisplay);*/
          route(origin_place_id, destination1_place_id, travel_mode,
                directionsService, directionsDisplay);
          
        });
          
         
          destination2_autocomplete.addListener('place_changed', function() {
          //var place1 = destination1_autocomplete.getPlace();
          var place = destination2_autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          expandViewportToFitPlace(map, place);

          // If the place has a geometry, store its place ID and route if we have
          // the other place ID
          destination2_place_id = place.place_id;
          if(destination1_place_id != ''){
             route2(origin_place_id, destination2_place_id, travel_mode,
                directionsService, directionsDisplay); 
          }else {
             route(origin_place_id, destination2_place_id, travel_mode,
                directionsService, directionsDisplay);
          }
          
        });

        destination3_autocomplete.addListener('place_changed', function() {
          //var place1 = destination1_autocomplete.getPlace();
          var place = destination3_autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          expandViewportToFitPlace(map, place);

          // If the place has a geometry, store its place ID and route if we have
          // the other place ID
          destination3_place_id = place.place_id;
          route3(origin_place_id, destination3_place_id, travel_mode,
                directionsService, directionsDisplay);
        });

        destination4_autocomplete.addListener('place_changed', function() {
          //var place1 = destination1_autocomplete.getPlace();
          var place = destination4_autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }
          expandViewportToFitPlace(map, place);

          // If the place has a geometry, store its place ID and route if we have
          // the other place ID
          destination4_place_id = place.place_id;
          route4(origin_place_id, destination4_place_id, travel_mode,
                directionsService, directionsDisplay);
        });
            
            
        function route(origin_place_id, destination1_place_id, travel_mode,
                       directionsService, directionsDisplay) {
          if (!origin_place_id || !destination1_place_id) {
            return;
          }
          directionsService.route({
            origin: {'placeId': origin_place_id},
            destination: {'placeId': destination1_place_id},
            travelMode: travel_mode
          }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        }
          
        function route2(origin_place_id, destination2_place_id, travel_mode,
                       directionsService, directionsDisplay) {
          var via = document.getElementById("destination1-input").value;
          var waypoint = [];
          if (via != '') {
              waypoint.push({
                 location: via,
                  stopover: true
              });
          }
          directionsService.route({
            origin: {'placeId': origin_place_id},
            waypoints: waypoint,
            //unitSystem: google.maps.UnitSystem.IMPERIAL,
            destination: {'placeId': destination2_place_id},
            travelMode: travel_mode
            }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        }
        function route3(origin_place_id, destination3_place_id, travel_mode,
                       directionsService, directionsDisplay) {
          var via1 = document.getElementById("destination1-input").value;
          var via2 = document.getElementById("destination2-input").value;
          var waypoint = [];
          waypoint.push({
            location: via1,
            stopover: true
          },
          {
            location: via2,
            stopover: true
          });
          directionsService.route({
            origin: {'placeId': origin_place_id},
            waypoints: waypoint,
            //unitSystem: google.maps.UnitSystem.IMPERIAL,
            destination: {'placeId': destination3_place_id},
            travelMode: travel_mode
            }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        }
        /*function route4(origin_place_id, destination4_place_id, travel_mode,
                       directionsService, directionsDisplay) {
          var via1 = document.getElementById("destination1-input").value;
          var via2 = document.getElementById("destination2-input").value;
          var via3 = document.getElementById("destination3-input").value;
          var waypoint = [];
          waypoint.push({
            location: via1,
            stopover: true
          },
          {
            location: via2,
            stopover: true
          },
          {
            location: via3,
            stopover: true
          });
          directionsService.route({
            origin: {'placeId': origin_place_id},
            waypoints: waypoint,
            //unitSystem: google.maps.UnitSystem.IMPERIAL,
            destination: {'placeId': destination4_place_id},
            travelMode: travel_mode
            }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        }*/

        function route4(origin_place_id, destination4_place_id, travel_mode,
                       directionsService, directionsDisplay) {
          var via1 = document.getElementById("destination1-input").value;
          var via2 = document.getElementById("destination2-input").value;
          var via3 = document.getElementById("destination3-input").value;
          var via4 = document.getElementById("destination4-input").value;

          var waypoint = [];
          waypoint.push({
            location: via1,
            stopover: true
          },
          {
            location: via2,
            stopover: true
          },
          {
            location: via3,
            stopover: true
          },
          {
            location: via4,
            stopover: true
          });
          directionsService.route({
            origin: {'placeId': origin_place_id},
            waypoints: waypoint,
            //unitSystem: google.maps.UnitSystem.IMPERIAL,
            destination: {'placeId': origin_place_id},
            travelMode: travel_mode
            }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        }

        function computeTotalDistance(result) {
        var total = 0;
        var myroute = result.routes[0];
        for (var i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
        }
        total = total / 1000;
        document.getElementById('total').innerHTML = total + ' km';
      }
    }

      google.maps.event.addDomListener(window, 'load', initialize);