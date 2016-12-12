$(function() {

  // icons and openweather APIs id for weather conditions
  var icons = [
    ['images/icons/clear-sky-day.png', 'clear-day'],
    ['images/icons/clear-sky-night.png','clear-night'],
    ['images/icons/few-clouds-day.png','partly-cloudy-day' ],
    ['images/icons/few-clouds-night.png','partly-cloudy-night'],
    ['images/icons/scattered-clouds.png','cloudy' ],
    ['images/icons/shower-rain.png','sleet' ],
    ['images/icons/rain.png','rain' ],
    ['images/icons/thunderstorm.png','thunderstorm' ],
    ['images/icons/snow.png','snow' ],
    ['images/icons/mist.png','fog' ]
  ];




  // get latitude and longitude from ip-api
  function getPositonData() {
    $('#loading').show();
    $.getJSON('https://freegeoip.net/json/', function(json, textStatus) {
      console.log('ip-api status: ', textStatus);
      console.log(json);
      getWeatherData(json);
    });
  }

  // get wather data from openweathermap
  function getWeatherData(json) {
    var latitude = json.latitude;
    var longitude = json.longitude;
    var url = 'https://api.darksky.net/forecast/ad8f72e2d802ce97b7ab502975c435ac/'+latitude+','+longitude+'?jsoncallback=?';
    $.getJSON(url, function(json, textStatus) {
      console.log('darksky.net API status: ', textStatus);
      console.log(json);
      calculateWeather(json);
      $('#loading').hide();
    });

  }

  function calculateWeather(json){
    // vars from openweather api
    var fahrenheits = json.currently.temperature;
    var celsius = Math.round((fahrenheits-32)* 5/9);

    var weatherId = json.currently.icon;
    var weather = json.currently.summary;
    var humidity = json.currently.humidity * 100;
    var pressure = json.currently.pressure;
    var windSpeed = json.currently.windSpeed;
    //var city = json.name;
    //var country = json.sys.country;

    // JSON from openweather api is in UTC this way we get it to local time
  /*  var sunrise = new Date(json.sys.sunrise * 1000).getTime();
    var sunset = new Date(json.sys.sunset * 1000).getTime();
    var timeNow = new Date().getTime();*/


    var id = findId(weatherId);
    var icon = icons[id][0];
    renderData(celsius,farenheits,weather,humidity,pressure,windSpeed,icon,id)


    // finds id in our icons array from weatherId
    function findId(weatherId) {

      var i = 0;
      for (i; i < icons.length; i++) {
        // finds where in our array icons is weatherId
        if (icons[i].indexOf(weatherId) > -1) {
            return i;
          }
        }
      }


    function renderData(celsius,farenheits,weather,humidity,pressure,windSpeed,icon,id){

      var $tempElement = $('#temperature');
      $tempElement.html(celsius + '&#8451;');
      $('#text').html('<span>'+weather+'</span>');
      $('#humidity').html('humidity: <span>'+humidity+' &#37;</span>');
      $('#pressure').html('pressure: <span>'+pressure+' hPa</span>');
      $('#wind').html('wind speed: <span>'+windSpeed+' miles/h</span>' );
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
