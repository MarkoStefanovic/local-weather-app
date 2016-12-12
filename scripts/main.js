$(function() {

  // icons and openweather APIs id for weather conditions
  var icons = [
    ['images/icons/clear-sky-day.png', 800],
    ['images/icons/clear-sky-night.png'],
    ['images/icons/few-clouds-day.png', 801],
    ['images/icons/few-clouds-night.png'],
    ['images/icons/scattered-clouds.png', 802, 803, 804],
    ['images/icons/shower-rain.png', 511, 520, 521, 522, 531],
    ['images/icons/rain.png', 500, 501, 502, 503, 504],
    ['images/icons/thunderstorm.png', 200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
    ['images/icons/snow.png', 600, 601, 602, 611, 612, 615, 616, 620, 621, 622],
    ['images/icons/mist.png', 701, 711, 721, 731, 741, 751, 761, 762, 771, 781]
  ];




  // get latitude and longitude from ip-api
  function getPositonData() {
    $('#loading').show();
    $.getJSON('https://freegeoip.net/json/', function(json, textStatus) {
      console.log('freegeoip status: ', textStatus);
      console.log(json);
      getWeatherData(json);
    });
  }

  // get wather data from openweathermap
  function getWeatherData(json) {
    var latitude = json.latitude;
    var longitude = json.longitude;
    var url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=f13e1562d642e6f9cde436564c251477';
    $.getJSON(url, function(json, textStatus) {
      console.log('openweathermap status: ', textStatus);
      console.log(json);
      calculateWeather(json);
      $('#loading').hide();
    });
  }

  function calculateWeather(json){
    // vars from openweather api
    var kelvins = json.main.temp;
    var celsius = Math.round(kelvins - 273.15);
    var farenheits = Math.round((kelvins * 9 / 5) - 459.67);
    var weatherId = json.weather[0].id;
    var weather = json.weather[0].description;
    var humidity = json.main.humidity;
    var pressure = json.main.pressure;
    var windSpeed = json.wind.speed;
    var city = json.name;
    var country = json.sys.country;

    // JSON from openweather api is in UTC this way we get it to local time
    var sunrise = new Date(json.sys.sunrise * 1000).getTime();
    var sunset = new Date(json.sys.sunset * 1000).getTime();
    var timeNow = new Date().getTime();


    var id = findId(weatherId, sunrise, sunset, timeNow);
    var icon = icons[id][0];
    renderData(celsius,farenheits,weather,humidity,pressure,windSpeed,icon,city,country,id)


    // finds id in our icons array from weatherId
    function findId(weatherId, sunrise, sunset, timeNow) {

      var i = 0;
      for (i; i < icons.length; i++) {
        // finds where in our array icons is weatherId
        if (icons[i].indexOf(weatherId) > -1) {
          // clear-sky and few-clouds in icons have day and night icon findout if its day or night
          if ((i == 0) || (i == 2)) {
            // check if is day or night based on sunrise and sunset and local time
            if ((timeNow > sunrise) && (timeNow < sunset)) {
              console.log('It is day.');
              return i;
            } else if (((timeNow > sunrise) && (timeNow > sunset)) || ((timeNow < sunrise) && (timeNow < sunset))) {
              console.log('It is night.');
              return i + 1;
            }
          } else {
            console.log('not clear-sky or few-clouds');
            return i;
          }
        }
      }
    }

    function renderData(celsius,farenheits,weather,humidity,pressure,windSpeed,icon,city,country,id){

      var $tempElement = $('#temperature');
      $tempElement.html(celsius + '&#8451;');
      $('#text').html('<span>'+weather+'</span>');
      $('#humidity').html('humidity: <span>'+humidity+' &#37;</span>');
      $('#pressure').html('pressure: <span>'+pressure+' hPa</span>');
      $('#wind').html('wind speed: <span>'+windSpeed+' m/s</span>' );
      $('#icon').html('<img src="' + icon + '" />');
      $('#city').html('location: <span>'+city + ', ' + country+'</span>');
      $('#cont').addClass('');
      $('#cont').addClass('.container bg'+id);

      // toggle temperature button
      $('#button').on('click',function() {
        if($('#check').is(':checked')){
          console.log('checked');
          return $tempElement.html(celsius + '&#8451;');
        }else{
          console.log('unchecked');
          return $tempElement.html(farenheits + '&#8457;');
        }
      });
    }
  }

getPositonData();

});
