

$(document).ready( function () {
        initialize();
        $.ajax({     
        url: "libs/php/countryName.php",
        type: 'GET',
        datatype:'json',
        data:null,
        
        success: function(result) {
			if (result.status.name == "ok") {
                $.each(result.data,function(index, item){
                     $("#countryDropdown").append("<option value="+item.countryCode+">"+item.countryName+"</option");
                }) 

                $("#humdity").append("Humidity : "+result.data.current.humidity);
            }
                
        },

        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});

$('#countryDropdown').change(function() {

  const inputText = $("#countryDropdown option:selected").text();

    geocoder.geocode( { 'address': inputText}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
           map.setCenter(results[0].geometry.location);
           var marker = new google.maps.Marker({
               map: map,
               position: results[0].geometry.location
           });
        } else {
          alert("Error: " + status);
        }
    });
    setCountryBoundry(inputText);
    getWeatherInformation(inputText);
   
});
    
function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
      zoom: 4,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
  }


  function setCountryBoundry(inputText) {
    let placeId;
    map = new google.maps.Map(document.getElementById("googleMap"), {
      center: { lat: 20.773, lng: -156.01 },
      zoom: 4,
      mapId: '1dad23c07d63496d',
    });
        featureLayer = map.getFeatureLayer("COUNTRY");


        // Define the styling options
        const featureStyleOptions = {
        strokeColor: "#810FCB",
        strokeOpacity: 1.0,
        strokeWeight: 3.0,
        fillColor: "#810FCB",
        fillOpacity: 0.5,
        };

        fetch("libs/json/placeId.json")
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
        for (let i = 0; i < data.length; i++) {
            if(data[i].countryName==inputText)
            {
                placeId=data[i].placeId
            }
        }
        })


        // Apply the style to a single boundary.
        featureLayer.style = (options) => {
        if (options.feature.placeId == placeId) {
        // Hana, HI
        return featureStyleOptions;
        }
        };

    }

    function getWeatherInformation(inputText)
    {
        $.ajax({     
            url: "libs/php/countryWeather.php",
            type: 'GET',
            dataType: 'json',
            data: {
                country: inputText
            },
            
            success: function(result) {
                if (result.status.name == "ok") {
                    document.getElementById('id01').style.display='block';
                    $("#countryName").empty();
                    $("#humdity").empty();
                    $("#tempC").empty();
                    $("#tempF").empty();
                    $("#localTime").empty();
                    $("#timeZone").empty();
                    $("#lastUpdated").empty();
                    $("#countryName").append(inputText);
                    $("#humdity").append("Humidity : "+result.data.current.humidity);
                    $("#tempC").append("Temperature in C: "+result.data.current.temp_c);
                    $("#tempF").append("Temperature in F :"+result.data.current.temp_f);
                    $("#localTime").append("Local Time : "+result.data.location.localtime);
                    $("#timeZone").append("Time Zone : "+result.data.location.tz_id);
                    $("#lastUpdated").append("Details updated on : "+ result.data.current.last_updated)
                }       
            },
    
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }
        }); 
    }
  