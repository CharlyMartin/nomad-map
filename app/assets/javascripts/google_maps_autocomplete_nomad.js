$(document).ready(function() {
  var nomad_address = $('#nomad_address').get(0);
  var session = sessionStorage.getItem('address');

  if (nomad_address) {
    var autocomplete = new google.maps.places.Autocomplete(nomad_address, { types: ['geocode'] });
    google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);
    google.maps.event.addDomListener(nomad_address, 'keydown', function(e) {
      if (e.keyCode == 13) {
        e.preventDefault(); // Do not submit the form on Enter.
      }
    });
  }

  if (session) {
    var components = JSON.parse(session);
    prefillForm(components);
  };

});

function onPlaceChanged() {
  var place = this.getPlace();
  var components = getAddressComponents(place);

  $('#nomad_address').trigger('blur').val(components.address);
  $('#nomad_zip_code').val(components.zip_code);
  $('#nomad_city').val(components.city);
  if (components.country_code) {
    $('#nomad_country').val(components.country_code);
  }
}

function prefillForm(object) {
  $('#nomad_address').val(object.address);
  $('#nomad_zip_code').val(object.zip_code);
  $('#nomad_city').val(object.city);
  if (object.country_code) {
    $('#nomad_country').val(object.country_code);
  }
}

function getAddressComponents(place) {
  // If you want lat/lng, you can look at:
  // - place.geometry.location.lat()
  // - place.geometry.location.lng()

  var street_number = null;
  var route = null;
  var zip_code = null;
  var city = null;
  var country_code = null;
  for (var i in place.address_components) {
    var component = place.address_components[i];
    for (var j in component.types) {
      var type = component.types[j];
      if (type == 'street_number') {
        street_number = component.long_name;
      } else if (type == 'route') {
        route = component.long_name;
      } else if (type == 'postal_code') {
        zip_code = component.long_name;
      } else if (type == 'locality') {
        city = component.long_name;
      } else if (type == 'country') {
        country_code = component.short_name;
      }
    }
  }

  return {
    address: street_number == null ? route : (street_number + ' ' + route),
    zip_code: zip_code,
    city: city,
    country_code: country_code
  };
}
